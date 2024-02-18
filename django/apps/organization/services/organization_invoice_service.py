# -*- coding: utf-8 -*-
from organization.graphene.types import StandardInvoiceItemInput
from organization.models import Organization, StandardInvoiceItem


def update_standard_invoice_item(
    organization: Organization, standard_invoice_item_input: StandardInvoiceItemInput
) -> StandardInvoiceItem:
    if standard_invoice_item_input.uuid:
        standard_invoice_item = organization.standard_invoice_items.get(
            uuid=standard_invoice_item_input.uuid
        )
    else:
        standard_invoice_item = StandardInvoiceItem(organization=organization)

    attrs = (
        "name",
        "unit_price",
        "unit_price_currency",
        "unit_price_type",
    )

    for attr in attrs:
        setattr(standard_invoice_item, attr, getattr(standard_invoice_item_input, attr))

    standard_invoice_item.save()
    return standard_invoice_item


def delete_standard_invoice_item(organization: Organization, uuid: str) -> None:
    organization.standard_invoice_items.get(uuid=uuid).delete()
