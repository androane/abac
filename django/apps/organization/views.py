# -*- coding: utf-8 -*-
from http.client import HTTPResponse

from core.renderers import render_to_pdf
from organization.models.invoice import Invoice
from report.services.denormalize_models_service import get_flattened_report_data


def download_invoice_details(request) -> HTTPResponse:
    user = request.user
    org = user.organization

    invoice = Invoice.objects.get(
        uuid=request.GET.get("invoice_uuid"), client__organization=org
    )

    df = get_flattened_report_data(
        org, invoice.year, invoice.month, client_uuids=[invoice.client.uuid]
    )
    print(df)
    response = render_to_pdf("invoice_details_template.html", {})

    filename = f"detalii_factura_{invoice.year}_{invoice.month}.pdf"

    content = f"attachment; filename={filename}"
    response["Content-Disposition"] = content
    return response
