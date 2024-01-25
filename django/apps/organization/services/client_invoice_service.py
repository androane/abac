# -*- coding: utf-8 -*-
from typing import Optional

import pendulum
from django.conf import settings

from organization.models import CustomerOrganization, Invoice
from user.models import User


def get_client_invoice(
    user: User,
    client_uuid: str,
    month: Optional[int] = None,
    year: Optional[int] = None,
) -> Invoice:
    assert (year and month) or (not year and not month)

    client = CustomerOrganization.objects.get(
        uuid=client_uuid, organization=user.organization
    )

    if year and month:
        return client.invoices.get_or_create(month=month, year=year)[0]

    now = pendulum.now(settings.DEFAULT_TIMEZONE)

    # If year and month are not given, it means we need to create an invoice for the current month
    try:
        return client.invoices.get(month=now.month, year=now.year)
    except Invoice.DoesNotExist:
        # Create invoice for current month
        invoice = Invoice.objects.create(client=client, month=now.month, year=now.year)

    last_month = now.subtract(months=1)
    try:
        last_month_invoice = client.invoices.get(
            year=last_month.year, month=last_month.month
        )
    except Invoice.DoesNotExist:
        pass
    else:
        # Copy recurring invoice items from last invoice
        for invoice_item in last_month_invoice.items.filter(is_recurring=True).all():
            invoice_item.pk = None
            invoice_item.invoice = invoice
            invoice_item.save()
        return invoice
