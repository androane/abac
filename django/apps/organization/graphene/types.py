# -*- coding: utf-8 -*-
import os

import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload

from organization.constants import CurrencyEnum, InvoiceStatusEnum
from organization.models import Client, ClientFile, Invoice, InvoiceItem

CurrencyEnumType = graphene.Enum.from_enum(CurrencyEnum)
InvoiceStatusEnumType = graphene.Enum.from_enum(InvoiceStatusEnum)


class InvoiceItemType(DjangoObjectType):
    class Meta:
        model = InvoiceItem
        only_fields = (
            "uuid",
            "description",
            "unit_price",
            "unit_price_currency",
            "item_date",
            "minutes_allocated",
            "is_recurring",
        )

    unit_price_currency = CurrencyEnumType()


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
        return self.items.all()


class InvoiceItemInput(graphene.InputObjectType):
    uuid = graphene.String()
    description = graphene.String(required=True)
    unit_price = graphene.Int()
    unit_price_currency = CurrencyEnumType()
    item_date = graphene.Date()
    minutes_allocated = graphene.Int()
    is_recurring = graphene.Boolean()


class ClientFileType(DjangoObjectType):
    class Meta:
        model = ClientFile
        only_fields = ("updated",)

    # Model properties
    url = graphene.NonNull(graphene.String)
    size = graphene.NonNull(graphene.Int)
    name = graphene.NonNull(graphene.String)

    def resolve_name(self, info):
        # Using os.path.basename to get rid of the path and onyl return the actual file name
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
            "cui",
        )

    files = graphene.List(graphene.NonNull(ClientFileType), required=True)

    def resolve_files(self, info, **kwargs):
        return self.files.all()
