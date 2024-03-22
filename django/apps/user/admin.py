# -*- coding: utf-8 -*-
from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from user.models import User


class IsProgramManagerFilter(SimpleListFilter):
    title = "Is Program Manager?"
    parameter_name = "is_program_manager"

    def lookups(self, request, model_admin):
        return [(True, "Yes"), (False, "No")]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(organization__isnull=False, client__isnull=True)
        return queryset


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    search_fields = ("email",)
    list_display = ("name", "email", "organization", "client")
    list_filter = ("organization", IsProgramManagerFilter)

    ordering = (
        "organization",
        "client",
        "last_name",
        "first_name",
    )
    fieldsets = (
        (None, {"fields": ("email", "password", "organization")}),
        (
            "Personal info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
