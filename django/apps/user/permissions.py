# -*- coding: utf-8 -*-
from functools import lru_cache
from typing import TYPE_CHECKING

from core.constants import BaseEnum
from core.exceptions import PermissionException

if TYPE_CHECKING:
    from user.models import User


class UserPermissionsEnum(BaseEnum):
    # The most powerful permission
    HAS_ORGANIZATION_ADMIN = "has_organization_admin"
    # General permissions
    HAS_SETTINGS_ACCESS = "has_settings_access"
    # Client permissions
    HAS_CLIENT_INVOICE_ACCESS = "has_invoice_access"
    HAS_CLIENT_INFORMATION_ACCESS = "has_client_information_access"
    HAS_CLIENT_ACTIVITY_COSTS_ACCESS = "has_client_activity_costs_access"
    HAS_CLIENT_ADD_ACCESS = "has_client_add_access"
    HAS_ALL_CLIENTS_ACCESS = "has_all_clients_access"
    HAS_OWN_CLIENTS_ACCESS = "has_own_clients_access"


USER_MODEL_PERMISSIONS = {
    # The most powerful permission
    UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value: "Has organization Admin",
    # General permissions
    UserPermissionsEnum.HAS_SETTINGS_ACCESS.value: "Has access to settings",
    # Client permissions
    UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS.value: "Has access to client invoices",
    UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS.value: "Has access to client general information",
    UserPermissionsEnum.HAS_CLIENT_ACTIVITY_COSTS_ACCESS.value: "Has access to client activities costs",
    UserPermissionsEnum.HAS_CLIENT_ADD_ACCESS.value: "Has access to add clients",
    UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS.value: "Has access to all clients",
    UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS.value: "Has access to clients the user is PM-ing",
}


@lru_cache
def validate_has_permission(user: "User", permission: UserPermissionsEnum):
    permissions = {permission, UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value}
    if not set(user.user_permissions.values_list("codename", flat=True)).intersection(
        permissions
    ):
        message = (
            f"User needs one of the following permissions: {', '.join(permissions)}"
        )
        raise PermissionException(message)
