# -*- coding: utf-8 -*-
from typing import Optional

from django.contrib.auth import get_user_model

from organization.graphene.types import InvoiceItemInput
from organization.models import CustomerOrganization, Invoice, InvoiceItem
from user.models import User


def update_or_create_client(
    user: User,
    name: str,
    uuid: Optional[str] = None,
    description: Optional[str] = None,
    phone_number_1: Optional[str] = "",
    phone_number_2: Optional[str] = "",
    program_manager_uuid: Optional[str] = None,
) -> None:
    program_manager = None
    if program_manager_uuid:
        program_manager = get_user_model().objects.get(
            is_staff=False, uuid=program_manager_uuid
        )

    kwargs = {
        "name": name,
        "description": description,
        "phone_number_1": phone_number_1,
        "phone_number_2": phone_number_2,
        "program_manager": program_manager,
    }

    if uuid:
        client = CustomerOrganization.objects.get(
            uuid=uuid, organization=user.organization
        )
        for key, value in kwargs.items():
            setattr(client, key, value)
        client.save()
        return client

    return CustomerOrganization.objects.create(organization=user.organization, **kwargs)


def update_client_invoice_item(
    user: User,
    client_uuid: str,
    invoice_uuid: str,
    invoice_item_input: InvoiceItemInput,
) -> CustomerOrganization:
    client = CustomerOrganization.objects.get(
        organization=user.organization,
        uuid=client_uuid,
    )
    invoice = Invoice.objects.get(
        client=client,
        uuid=invoice_uuid,
    )
    return InvoiceItem.objects.update_or_create(
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
    )[0]
