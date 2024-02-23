# -*- coding: utf-8 -*-
from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from organization.models import (
    Client,
    ClientFile,
    Invoice,
    Organization,
    StandardInvoiceItem,
)


@admin.register(Organization)
class OrganizationAdmin(SimpleHistoryAdmin):
    search_fields = ("name",)
    list_filter = ("name",)
    history_list_display = [
        "name",
    ]
    fields = ("name", "logo")
    ordering = ("name",)


class InvoiceAdmin(admin.TabularInline):
    model = Invoice
    list_display = ("year", "month", "date_sent")
    history_list_display = [
        "date_sent",
    ]


class ClientFileAdmin(admin.TabularInline):
    model = ClientFile
    fields = ("name", "description", "file")
    extra = 1


@admin.register(Client)
class ClientAdmin(SimpleHistoryAdmin):
    list_display = (
        "name",
        "organization",
        "program_manager",
        "phone_number_1",
        "phone_number_2",
    )
    history_list_display = [
        "name",
    ]
    ordering = ("organization__name", "name")
    list_filter = ("organization__name",)

    inlines = [ClientFileAdmin, InvoiceAdmin]


@admin.register(StandardInvoiceItem)
class StandardInvoiceItemAdmin(SimpleHistoryAdmin):
    list_display = (
        "name",
        "organization",
        "unit_price",
        "unit_price_currency",
        "unit_price_type",
    )
    ordering = ("organization__name", "name")
    list_filter = ("organization__name",)
