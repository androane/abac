# -*- coding: utf-8 -*-
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.utils.cache import patch_vary_headers

from api.services.auth_service import (
    get_authorization_from_jwt_token,
    get_token_from_request,
)
from core.http import HttpResponseUnauthorized


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


class IntrospectionDisabledException(Exception):
    pass


class DisableIntrospectionMiddleware:
    """
    This middleware should use for production mode. It hides the introspection.
    """

    def resolve(self, next, root, info, **kwargs):
        if info.field_name.lower() in ["__schema", "__introspection"]:
            raise IntrospectionDisabledException
        return next(root, info, **kwargs)
