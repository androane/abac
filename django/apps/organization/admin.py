# -*- coding: utf-8 -*-
from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from organization.models import Client, ClientFile, Invoice, Organization


@admin.register(Organization)
class OrganizationAdmin(SimpleHistoryAdmin):
    search_fields = ("name",)
    list_filter = ("name",)
    history_list_display = [
        "name",
    ]


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
    search_fields = ("name",)
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

    inlines = [ClientFileAdmin, InvoiceAdmin]
