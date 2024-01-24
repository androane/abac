# -*- coding: utf-8 -*-
from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from organization.models import CustomerOrganization, Invoice, Organization


@admin.register(Organization)
class OrganizationAdmin(SimpleHistoryAdmin):
    search_fields = ("name",)
    list_filter = ("name",)
    history_list_display = [
        "name",
    ]


@admin.register(CustomerOrganization)
class CustomerOrganizationAdmin(SimpleHistoryAdmin):
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


@admin.register(Invoice)
class InvoiceAdmin(SimpleHistoryAdmin):
    list_display = ("year", "month", "date_sent")
    history_list_display = [
        "date_sent",
    ]
