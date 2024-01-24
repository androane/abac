# -*- coding: utf-8 -*-
from typing import Optional

from organization.graphene.types import InvoiceItemInput
from organization.models import CustomerOrganization, Invoice, InvoiceItem
from user.models import User


def update_or_create_customer_organization(
    user: User,
    uuid: str,
    name: str,
    phoneNumber1: str,
    phoneNumber2: str,
    description: Optional[str],
    program_manager_uuid: Optional[str],
) -> None:
    program_manager = User.objects.get(uuid=program_manager_uuid)
    CustomerOrganization.objects.update_or_create(
        uuid=uuid,
        organization=user.organization,
        defaults={
            "name": name,
            "description": description,
            "program_manager": program_manager,
            "phoneNumber1": phoneNumber1,
            "phoneNumber2": phoneNumber2,
        },
    )


def update_customer_organization_invoice_item(
    user: User,
    customer_organization_uuid: str,
    invoice_uuid: str,
    invoice_item_input: InvoiceItemInput,
) -> CustomerOrganization:
    customer_organization = CustomerOrganization.objects.get(
        organization=user.organization,
        uuid=customer_organization_uuid,
    )
    invoice = Invoice.objects.get(
        customer_organization=customer_organization,
        uuid=invoice_uuid,
    )
    InvoiceItem.objects.update_or_create(
        invoice=invoice,
        uuid=invoice_item_input.uuid,
        defaults={
            "description": invoice_item_input.description,
            "unit_price": invoice_item_input.unit_price,
            "unit_price_currency": invoice_item_input.unit_price_currency,
            "item_date": invoice_item_input.item_date,
            "minutes_allocated": invoice_item_input.minutes_allocated,
            "is_recurring": invoice_item_input.is_recurring,
        },
    )
