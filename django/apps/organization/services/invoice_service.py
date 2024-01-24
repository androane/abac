# -*- coding: utf-8 -*-
from typing import Optional

import pendulum
from django.conf import settings

from organization.models import CustomerOrganization, Invoice
from user.models import User


def get_customer_organization_invoice(
    user: User,
    customer_organization_uuid: str,
    month: Optional[int] = None,
    year: Optional[int] = None,
) -> Invoice:
    assert (year and month) or (not year and not month)

    customer_organization = CustomerOrganization.objects.get(
        uuid=customer_organization_uuid, organization=user.organization
    )

    now = pendulum.now(settings.DEFAULT_TIMEZONE)

    if year and month:
        return customer_organization.invoices.get(month=now.month, year=now.year)

    # If year and month are not given, it means we need to create an invoice for the current month
    try:
        return customer_organization.invoices.get(month=now.month, year=now.year)
    except Invoice.DoesNotExist:
        last_invoice = (
            Invoice.objects.filter(customer_organization=customer_organization)
            .order_by("-year", "-month")
            .first()
        )
        # Create invoice for current month
        invoice = Invoice.objects.create(
            customer_organization=customer_organization, month=now.month, year=now.year
        )
        if last_invoice:
            # Copy recurring invoice items from last invoice
            for invoice_item in last_invoice.items.filter(is_recurring=True).all():
                invoice_item.pk = None
                invoice_item.invoice = invoice
                invoice_item.save()
        return invoice
