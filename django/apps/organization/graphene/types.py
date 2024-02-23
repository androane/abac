# -*- coding: utf-8 -*-
import os

import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload

from organization.constants import (
    ClientUserRoleEnum,
    CurrencyEnum,
    InvoiceStatusEnum,
    UnitPriceTypeEnum,
)
from organization.models import (
    Client,
    ClientFile,
    ClientUserProfile,
    Invoice,
    InvoiceItem,
    Organization,
    StandardInvoiceItem,
)
from user.graphene.types import UserType

CurrencyEnumType = graphene.Enum.from_enum(CurrencyEnum)
UnitPriceTypeEnumType = graphene.Enum.from_enum(UnitPriceTypeEnum)
InvoiceStatusEnumType = graphene.Enum.from_enum(InvoiceStatusEnum)
ClientUserRoleEnumType = graphene.Enum.from_enum(ClientUserRoleEnum)


class StandardInvoiceItemType(DjangoObjectType):
    class Meta:
        model = StandardInvoiceItem
        only_fields = (
            "uuid",
            "name",
            "unit_price",
            "unit_price_currency",
            "unit_price_type",
        )

    unit_price_currency = CurrencyEnumType()
    unit_price_type = UnitPriceTypeEnumType()


class InvoiceItemType(DjangoObjectType):
    class Meta:
        model = InvoiceItem
        only_fields = (
            "uuid",
            "name",
            "unit_price",
            "unit_price_currency",
            "unit_price_type",
            "description",
            "item_date",
            "minutes_allocated",
            "is_recurring",
            "standard_invoice_item",
            "quantity",
        )

    total = graphene.Float(required=True)
    unit_price_currency = CurrencyEnumType()
    unit_price_type = UnitPriceTypeEnumType()


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        only_fields = (
            "uuid",
            "name",
        )

    standard_invoice_items = graphene.List(
        graphene.NonNull(StandardInvoiceItemType), required=True
    )
    logo_url = graphene.NonNull(graphene.String)

    def resolve_logo_url(self, info):
        if self.logo:
            return self.logo.url

    def resolve_standard_invoice_items(self, info, **kwargs):
        return self.standard_invoice_items.all()


class TotalByCurrencyType(graphene.ObjectType):
    currency = CurrencyEnumType(required=True)
    total = graphene.Float(required=True)


class InvoiceType(DjangoObjectType):
    class Meta:
        model = Invoice
        only_fields = (
            "uuid",
            "month",
            "year",
            "date_sent",
        )

    totals_by_currency = graphene.List(
        graphene.NonNull(TotalByCurrencyType), required=True
    )
    items = graphene.List(graphene.NonNull(InvoiceItemType), required=True)

    def resolve_totals_by_currency(self, info, **kwargs):
        return [
            {
                "currency": currency,
                "total": total,
            }
            for currency, total in self.totals_by_currency.items()
        ]

    def resolve_items(self, info, **kwargs):
        return self.items.all()


class StandardInvoiceItemInput(graphene.InputObjectType):
    uuid = graphene.String()
    name = graphene.String(required=True)
    unit_price = graphene.Int(required=True)
    unit_price_currency = CurrencyEnumType(required=True)
    unit_price_type = UnitPriceTypeEnumType(required=True)


class InvoiceItemInput(graphene.InputObjectType):
    uuid = graphene.String()
    name = graphene.String()
    unit_price = graphene.Int()
    unit_price_currency = CurrencyEnumType()
    standard_service_uuid = graphene.String()
    description = graphene.String()
    item_date = graphene.Date()
    minutes_allocated = graphene.Int()
    is_recurring = graphene.Boolean()
    quantity = graphene.Int(required=True)


class ClientFileType(DjangoObjectType):
    class Meta:
        model = ClientFile
        only_fields = (
            "uuid",
            "updated",
        )

    # Model properties
    url = graphene.NonNull(graphene.String)
    size = graphene.NonNull(graphene.Int)
    name = graphene.NonNull(graphene.String)

    def resolve_name(self, info):
        # Using os.path.basename to get rid of the path and only return the actual file name
        return os.path.basename(self.file.name)


class ClientFileInput(graphene.InputObjectType):
    file = Upload(required=True)


class ClientType(DjangoObjectType):
    class Meta:
        model = Client
        only_fields = (
            "uuid",
            "name",
            "description",
            "phone_number_1",
            "phone_number_2",
            "program_manager",
            "spv_username",
            "spv_password",
            "cui",
        )

    files = graphene.List(graphene.NonNull(ClientFileType), required=True)
    users = graphene.List(graphene.NonNull(UserType), required=True)

    def resolve_files(self, info, **kwargs):
        return self.files.all()

    def resolve_users(self, info, **kwargs):
        return get_user_model().objects.filter(
            organization=info.contenxt.user.organization, client_profile=self
        )


class ClientUserProfileType(DjangoObjectType):
    class Meta:
        model = ClientUserProfile
        only_fields = (
            "uuid",
            "ownership_percentage",
            "role",
            "spv_username",
            "spv_password",
            "phone_number",
        )

    role = ClientUserRoleEnumType()


class ClientUserInput(graphene.InputObjectType):
    uuid = graphene.String()
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    email = graphene.String(required=True)
    role = ClientUserRoleEnumType()
    ownership_percentage = graphene.Int()
    spv_username = graphene.String()
    spv_password = graphene.String()
    phone_number = graphene.String()
