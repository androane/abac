# -*- coding: utf-8 -*-
from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from api.graphene.schema import schema
from api.middleware import DisableIntrospectionMiddleware
from api.views import GraphQLView

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "graphql/",
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
