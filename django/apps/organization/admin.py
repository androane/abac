# -*- coding: utf-8 -*-
from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from organization.models import CustomerOrganization, Organization


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
        "monthly_invoice_ammount",
        "monthly_invoice_currency",
    )
    history_list_display = [
        "name",
    ]
