# -*- coding: utf-8 -*-
import logging

from django.http import HttpResponse, HttpResponseNotAllowed
from graphene_django.views import HttpError
from graphene_file_upload.django import FileUploadGraphQLView
from sentry_sdk import capture_exception

from api.data_loaders import LOADERS

logger = logging.getLogger(__name__)


class GraphQLView(FileUploadGraphQLView):
    def get_context(self, request):
        for loader_function_name, loader_function in LOADERS.items():
            setattr(request, loader_function_name, loader_function())
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

        try:
            operation_name = args[1].get("operationName")
        except Exception as e:
            capture_exception(e)

        graphql_request = self.parse_body(args[0])
        variables = graphql_request.get("variables", "")
        operation_name = graphql_request.get("operationName", "")

        if variables:
            print("\n", operation_name, variables, "\n")
        else:
            print("\n", operation_name, "\n")

        result = super().execute_graphql_request(*args, **kwargs)

        if result and result.errors:
            for error in result.errors:
                logger.warning(error)

                try:
                    raise error.original_error
                except Exception as e:
                    capture_exception(e)

        return result
