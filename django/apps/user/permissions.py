# -*- coding: utf-8 -*-
import functools
from typing import TYPE_CHECKING

from core.constants import BaseEnum
from core.graphql_errors import GraphQLErrorForbidden, GraphQLErrorUnauthorized

if TYPE_CHECKING:
    from user.models import User


class UserPermissionsEnum(BaseEnum):
    HAS_ORGANIZATION_ADMIN = "has_organization_admin"
    HAS_SETTINGS_ACCESS = "has_settings_access"
    # Client permissions
    HAS_CLIENT_INVOICE_ACCESS = "has_invoice_access"
    HAS_CLIENT_INFORMATION_ACCESS = "has_client_information_access"
    HAS_CLIENT_ACTIVITY_COSTS_ACCESS = "has_client_activity_costs_access"
    HAS_CLIENT_ADD_ACCESS = "has_client_add_access"


USER_PERMISSIONS = {
    UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value: "Has organization Admin",
    UserPermissionsEnum.HAS_SETTINGS_ACCESS.value: "Has access to settings",
    # Client permissions
    UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS.value: "Has access to client invoices",
    UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS.value: "Has access to client general information",
    UserPermissionsEnum.HAS_CLIENT_ACTIVITY_COSTS_ACCESS.value: "Has access to client activities costs",
    UserPermissionsEnum.HAS_CLIENT_ADD_ACCESS.value: "Has access to add clients",
}


def check_permission(user: "User", permission: UserPermissionsEnum, func=None):
    if not user.is_authenticated:
        raise GraphQLErrorUnauthorized()

    permissions = {permission, UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value}
    if not set(user.user_permissions.values_list("codename", flat=True)).intersection(
        permissions
    ):
        message = f"Only users with {', '.join(permissions)} permissions are allowed to perform this query or mutation."
        raise GraphQLErrorForbidden(message)


def permission_required(permission):
    def inner(func):
        @functools.wraps(func)
        def decorator(self, info, *args, **kwargs):
            from user.models import User

            if type(info) is User:
                user = info
            else:
                user = info.context.user
            check_permission(user, permission, func)
            return func(self, info, *args, **kwargs)

        return decorator

    return inner


def field_permission_required(permission):
    def inner(func):
        @functools.wraps(func)
        def decorator(self, info, *args, **kwargs):
            user = info.context.user
            try:
                check_permission(user, permission, func)
            except (GraphQLErrorForbidden, GraphQLErrorUnauthorized):
                return None
            return func(self, info, *args, **kwargs)

        return decorator

    return inner
