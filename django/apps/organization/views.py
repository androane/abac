# -*- coding: utf-8 -*-
from http.client import HTTPResponse

from django.core.exceptions import PermissionDenied

from core.exceptions import PermissionException
from core.renderers import render_to_pdf
from organization.locales import CATEGORY_TRANSLATIONS, MONTH_TRANSLATIONS
from organization.models.client import Client
from organization.models.invoice import Invoice
from organization.services.client.client_activity_service import (
    get_client_activities,
    get_client_solutions,
)
from user.permissions import UserPermissionsEnum, validate_has_permission


def download_invoice_enclosure(request) -> HTTPResponse:
    user = request.user

    include_logs_times = request.GET.get("include_logs_times", False)

    if not user.is_authenticated:
        raise PermissionDenied

    try:
        validate_has_permission(
            user, UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS.value
        )
    except PermissionException:
        raise PermissionDenied

    org = user.organization

    invoice = Invoice.objects.get(
        uuid=request.GET.get("invoice_uuid"), client__organization=org
    )

    client: Client = invoice.client

    client_solutions = get_client_solutions(user, client, invoice.month, invoice.year)
    client_activities = (
        get_client_activities(user, client, invoice.month, invoice.year)
        .filter(is_executed=True)
        .select_related("activity", "activity__category")
        .prefetch_related("logs")
    )

    context = {
        "month": MONTH_TRANSLATIONS[invoice.month],
        "year": invoice.year,
        "CATEGORY_TRANSLATIONS": CATEGORY_TRANSLATIONS,
        "client_name": client.name,
        "client_solutions": client_solutions,
        "client_activities": client_activities,
        "include_logs_times": include_logs_times,
    }

    response = render_to_pdf("invoice_enclosure_template.html", context)

    filename = f"detalii_factura_{invoice.month}_{invoice.year}.pdf"

    content = f"attachment; filename={filename}"
    response["Content-Disposition"] = content
    return response
