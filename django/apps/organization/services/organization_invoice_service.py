# -*- coding: utf-8 -*-
from organization.graphene.types import StandardInvoiceItemInput
from organization.models import (
    Organization,
    StandardInvoiceItem,
    StandardInvoiceItemCategory,
)


def update_standard_invoice_item(
    organization: Organization, standard_invoice_item_input: StandardInvoiceItemInput
) -> StandardInvoiceItem:
    if standard_invoice_item_input.uuid:
        standard_invoice_item = organization.standard_invoice_items.get(
            uuid=standard_invoice_item_input.uuid
        )
    else:
        category = StandardInvoiceItemCategory.objects.get(
            code=standard_invoice_item_input.category_code
        )
        standard_invoice_item = StandardInvoiceItem(
            organization=organization, category=category
        )

    attrs = (
        "name",
        "unit_price",
        "unit_price_currency",
        "unit_price_type",
    )

    for attr in attrs:
        value = getattr(standard_invoice_item_input, attr)
        if value:
            setattr(standard_invoice_item, attr, value)

    standard_invoice_item.save()
    return standard_invoice_item


def delete_standard_invoice_item(organization: Organization, uuid: str) -> None:
    organization.standard_invoice_items.get(uuid=uuid).delete()


def get_organization_services(organization: Organization) -> list[StandardInvoiceItem]:
    return organization.standard_invoice_items.all()
