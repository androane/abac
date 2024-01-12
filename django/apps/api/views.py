# -*- coding: utf-8 -*-
import logging

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
