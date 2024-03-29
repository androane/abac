# -*- coding: utf-8 -*-
from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from organization.models import (
    Activity,
    Client,
    ClientFile,
    Invoice,
    Organization,
    Solution,
)
from organization.models.organization import OrganizationBusinessCategory


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
    )
    history_list_display = [
        "name",
    ]
    ordering = ("organization__name", "name")
    list_filter = ("organization__name",)

    inlines = [ClientFileAdmin, InvoiceAdmin]


@admin.register(Activity)
class ActivityAdmin(SimpleHistoryAdmin):
    list_display = (
        "name",
        "organization",
        "unit_cost",
        "unit_cost_currency",
        "unit_cost_type",
    )
    ordering = ("organization__name", "name")
    list_filter = ("organization__name",)


@admin.register(OrganizationBusinessCategory)
class OrganizationBusinessCategoryAdmin(SimpleHistoryAdmin):
    list_display = ("name",)


@admin.register(Solution)
class SolutionAdmin(SimpleHistoryAdmin):
    list_display = ("name", "organization")
    ordering = ("organization__name", "name")
    list_filter = ("organization__name",)
