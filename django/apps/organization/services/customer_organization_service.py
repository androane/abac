# -*- coding: utf-8 -*-
from typing import Optional

from organization.graphene.types import InvoiceItemInput
from organization.models import CustomerOrganization, InvoiceItem
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


def update_or_create_customer_organization_invoice_item(
    user: User,
    customer_organization_uuid: str,
    invoice_item: InvoiceItemInput,
) -> CustomerOrganization:
    customer_organization = CustomerOrganization.objects.get(
        organization=user.organization,
        uuid=customer_organization_uuid,
    )
    InvoiceItem.objects.update_or_create(
        customer_organization=customer_organization,
        uuid=invoice_item.uuid,
        defaults={
            "description": invoice_item.description,
            "unit_price": invoice_item.unit_price,
            "unit_price_currency": invoice_item.unit_price_currency,
            "date_sent": invoice_item.date_sent,
            "minutes_allocated": invoice_item.minutes_allocated,
            "is_fixed_cost": invoice_item.is_fixed_cost,
        },
    )
