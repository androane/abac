# -*- coding: utf-8 -*-
from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphql_sync_dataloaders import DeferredExecutionContext

from api.graphene.schema import schema
from api.graphql_views import GraphQLView
from api.introspection_middleware import DisableIntrospectionMiddleware
from organization.views import download_invoice_enclosure

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "download/invoice-details",
        csrf_exempt(download_invoice_enclosure),
        name="download_invoice_enclosure",
    ),
    path(
        "graphql",
        csrf_exempt(
            GraphQLView.as_view(
                graphiql=settings.GRAPHQL_DEBUG,
                schema=schema,
                execution_context_class=DeferredExecutionContext,
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
