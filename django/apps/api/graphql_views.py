# -*- coding: utf-8 -*-
import logging

from django.conf import settings
from django.http import HttpResponse, HttpResponseNotAllowed
from graphene_django.views import GraphQLView as BaseGraphQLView
from graphene_django.views import HttpError

logger = logging.getLogger(__name__)


class GraphQLView(BaseGraphQLView):
    def get_context(self, request):
        return request

    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() not in ("get", "post", "options"):
            raise HttpError(
                HttpResponseNotAllowed(
                    ["GET", "POST", "OPTIONS"],
                    "GraphQL only supports GET, POST and OPTIONS requests.",
                )
            )

        if request.method.lower() == "options":
            return HttpResponse(status=200, content="", content_type="application/json")

        return super().dispatch(request, *args, **kwargs)

    def execute_graphql_request(self, *args, **kwargs):
        """Extract any exceptions and send them to Sentry if settings.DEBUG, raise them

        Graphql seems to swallow the stacktrace so this is to get access to it
        and do something useful with it.

        See: https://github.com/graphql-python/graphene-django/issues/124
        """

        # Log request data so that we can view it / debug if there's a runtime error while it's executed.
        # Note: this is similarly accomplished in Moesif but it's less expensive to do it here when
        # the number of requests scales.
        graphql_request = self.parse_body(args[0])
        variables = graphql_request.get("variables", "")
        operation_name = graphql_request.get("operationName", "")
        logger.warning(operation_name)
        logger.warning(variables)

        result = super().execute_graphql_request(*args, **kwargs)
        if result and result.errors:
            logger.warning("GraphQL Error: %s", result.errors)
            for error in result.errors:
                if hasattr(error, "original_error") and settings.DEBUG:
                    raise error.original_error

        return result
