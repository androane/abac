# -*- coding: utf-8 -*-
import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.utils.cache import patch_vary_headers

# Ignore this logger because it logs errors as strings instead of actual errors
# and we lose a lot of Sentry's features. Instead use SentryMiddleware.
from sentry_sdk import capture_exception
from sentry_sdk.integrations.logging import ignore_logger

from api.services.auth_service import (
    get_authorization_from_jwt_token,
    get_token_from_request,
)
from core.graphql_errors import GraphQLErrorUnauthorized
from core.http import HttpResponseUnauthorized

ignore_logger("graphql.execution.utils")
logger = logging.getLogger(__name__)


class SentryMiddleware:
    """
    Properly capture errors during query execution and send them to Sentry.
    Then raise the error again and let Graphene handle it.
    """

    def on_error(self, error):
        if not isinstance(error, GraphQLErrorUnauthorized) and not settings.DEBUG:
            capture_exception(error)
        raise error

    def resolve(self, next, root, info, **args):
        return next(root, info, **args).catch(self.on_error)


class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = get_token_from_request(request)
        authorization = get_authorization_from_jwt_token(token)

        if (
            request.user.is_authenticated
            and not authorization.is_authenticated
            and request.user.is_staff
        ):
            return self.get_response(request)

        if authorization.is_authenticated:
            User = get_user_model()
            try:
                user = User.objects.get(
                    id=authorization.claims["user_id"],
                    is_active=True,
                    organization__isnull=False,
                )
            except User.DoesNotExist:
                return HttpResponseUnauthorized()

            setattr(
                user,
                "is_impersonator",
                authorization.claims.get("is_impersonator", False),
            )
        else:
            user = AnonymousUser()

        request.user = user

        response = self.get_response(request)
        patch_vary_headers(response, ("Authorization",))

        return response
