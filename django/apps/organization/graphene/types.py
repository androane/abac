# -*- coding: utf-8 -*-
import graphene
from graphene_django import DjangoObjectType

from organization.constants import CurrencyEnum
from organization.models import CustomerOrganization, InvoiceItem

CurrencyEnumType = graphene.Enum.from_enum(CurrencyEnum)


class InvoiceItemType(DjangoObjectType):
    class Meta:
        model = InvoiceItem
        only_fields = (
            "uuid",
            "description",
            "unit_price",
            "unit_price_currency",
            "date_sent",
            "minutes_allocated",
            "is_fixed_cost",
        )

    unit_price_currency = CurrencyEnumType()


class CustomerOrganizationType(DjangoObjectType):
    invoice_items = graphene.List(graphene.NonNull(InvoiceItemType), required=True)

    class Meta:
        model = CustomerOrganization
        only_fields = (
            "uuid",
            "name",
            "description",
            "phone_number_1",
            "phone_number_2",
            "program_manager",
            "invoice_items",
        )

    def resolve_invoice_items(self, info, **kwargs):
        return self.customer_organization_invoice_items.all()


class InvoiceItemInput(graphene.InputObjectType):
    uuid = graphene.String()
    description = graphene.String(required=True)
    unit_price = graphene.Int()
    unit_price_currency = CurrencyEnumType()
    date_sent = graphene.Date()
    minutes_allocated = graphene.Int()
    is_fixed_cost = graphene.Boolean()
