# -*- coding: utf-8 -*-
from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from api.graphene.schema import schema
from api.graphql_views import GraphQLView
from api.introspection_middleware import DisableIntrospectionMiddleware

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "graphql",
        csrf_exempt(
            GraphQLView.as_view(
                graphiql=settings.GRAPHQL_DEBUG,
                schema=schema,
                middleware=(
                    None
                    if settings.GRAPHQL_DEBUG
                    else [DisableIntrospectionMiddleware()]
                ),
            )
        ),
    ),
]

handler404 = "core.views.handler_404"
