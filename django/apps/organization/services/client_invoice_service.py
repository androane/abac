# -*- coding: utf-8 -*-
import pendulum

from organization.constants import InvoiceStatusEnum
from organization.models import Client, Invoice, Organization


def get_client_invoice(
    client: Client,
    month: int,
    year: int,
) -> Invoice:
    # If year and month are not given, it means we need to create an invoice for the current month
    try:
        return client.invoices.get(month=month, year=year)
    except Invoice.DoesNotExist:
        # Create invoice for current month
        invoice = Invoice.objects.create(client=client, month=month, year=year)

    return invoice


def generate_invoice_items(invoice: Invoice) -> list[str]:
    client = invoice.client
    return client


def update_client_invoice_status(
    org: Organization, invoice_uuid: str, status: InvoiceStatusEnum
) -> Invoice:
    invoice = Invoice.objects.get(
        uuid=invoice_uuid,
        client__organization=org,
    )
    if status == InvoiceStatusEnum.SENT.value:
        invoice.date_sent = pendulum.now()
    elif status == InvoiceStatusEnum.DRAFT.value:
        invoice.date_sent = None

    invoice.save()
    return invoice
