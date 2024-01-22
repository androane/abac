# -*- coding: utf-8 -*-
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from user.models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("email", "organization")

    ordering = (
        "organization",
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
