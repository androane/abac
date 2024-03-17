# -*- coding: utf-8 -*-
from core.constants import BaseEnum


class UserPermissionsEnum(BaseEnum):
    HAS_ORGANIZATION_ADMIN = "has_organization_admin"
    HAS_SETTINGS_ACCESS = "has_settings_access"
    # Client permissions
    HAS_CLIENT_INVOICE_ACCESS = "has_invoice_access"
    HAS_CLIENT_GENERAL_INFORMATION_ACCESS = (
        "has_client_general_information_costs_access"
    )
    HAS_CLIENT_ACTIVITY_COSTS_ACCESS = "has_client_activity_costs_access"
    HAS_CLIENT_ADD_ACCESS = "has_client_add_access"


USER_PERMISSIONS = {
    UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value: "Has organization Admin",
    UserPermissionsEnum.HAS_SETTINGS_ACCESS.value: "Has access to settings",
    # Client permissions
    UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS.value: "Has access to client invoices",
    UserPermissionsEnum.HAS_CLIENT_GENERAL_INFORMATION_ACCESS.value: "Has access to client general information",
    UserPermissionsEnum.HAS_CLIENT_ACTIVITY_COSTS_ACCESS.value: "Has access to client activities costs",
    UserPermissionsEnum.HAS_CLIENT_ADD_ACCESS.value: "Has access to add clients",
}
