# -*- coding: utf-8 -*-
import graphene
from graphene_django import DjangoObjectType

from organization.graphene.types.enums import CurrencyEnumType
from organization.models import Invoice
from organization.services.client.client_invoice_service import generate_invoice_items


class InvoiceItemType(graphene.ObjectType):
    solution_name = graphene.String()
    category = graphene.NonNull("organization.graphene.types.CategoryType")
    quantity = graphene.Int(required=True)
    cost = graphene.Float(required=True)
    currency = CurrencyEnumType(required=True)


class InvoiceType(DjangoObjectType):
    class Meta:
        model = Invoice
        only_fields = (
            "uuid",
            "month",
            "year",
            "date_sent",
        )

    items = graphene.List(graphene.NonNull(InvoiceItemType), required=True)

    def resolve_items(self, info, **kwargs):
        return generate_invoice_items(info.context.user, self)
