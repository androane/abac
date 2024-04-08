# -*- coding: utf-8 -*-
from django.contrib.auth.models import Permission

from organization.models.organization import Organization
from user.permissions import UserPermissionsEnum


def toggle_user_permission(
    org: Organization, user_uuid: str, permission: UserPermissionsEnum
) -> None:
    user = org.users.get(uuid=user_uuid)
    perm = Permission.objects.get(codename=permission)
    if user.user_permissions.filter(codename=permission).exists():
        user.user_permissions.remove(perm)
    else:
        user.user_permissions.add(perm)

        # The following 2 permissions are mutually exclusive
        # If one is added, we need to remove the other one
        if perm.codename == UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS.value:
            user.user_permissions.remove(
                Permission.objects.get(
                    codename=UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS.value
                )
            )
        elif perm.codename == UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS.value:
            user.user_permissions.remove(
                Permission.objects.get(
                    codename=UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS.value
                )
            )
    return user
