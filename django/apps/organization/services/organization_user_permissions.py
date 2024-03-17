# -*- coding: utf-8 -*-
from typing import Iterable

from django.contrib.auth.models import Permission

from organization.models.client import Client, ClientUserObjectPermission
from organization.models.organization import Organization
from user.models import User
from user.permissions import UserPermissionsEnum

# These permissions are mutually exclusive, i.e. they can;t be both assigned to a user at the same time
PERMISSIONS = (
    UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS.value,
    UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS.value,
)


def update_user_client_permissions(
    org: Organization, user_uuid: str, client_uuids: list[str]
) -> None:
    user: User = org.users.get(uuid=user_uuid)

    # Remove the bulk client permissions since we are giving individual access
    for permission_codename in PERMISSIONS:
        permission = Permission.objects.get(codename=permission_codename)
        user.user_permissions.remove(permission)

    client_ids = set(
        org.clients.filter(uuid__in=client_uuids).values_list("id", flat=True)
    )

    # Delete permissions that were not passed in
    ClientUserObjectPermission.objects.filter(user=user).exclude(
        content_object_id__in=client_ids
    ).delete()

    existing_permission_ids = set(
        ClientUserObjectPermission.objects.filter(user=user).values_list(
            "content_object_id", flat=True
        )
    )
    new_client_ids = client_ids - existing_permission_ids

    if new_client_ids:
        permission = Permission.objects.get(
            codename=UserPermissionsEnum.HAS_CLIENT_ACCESS.value
        )
        ClientUserObjectPermission.objects.bulk_create(
            [
                ClientUserObjectPermission(
                    user=user, content_object_id=client_id, permission=permission
                )
            ]
            for client_id in new_client_ids
        )


def get_client_user_permissions(user: User) -> Iterable[Client]:
    permission = Permission.objects.get(
        codename=UserPermissionsEnum.HAS_CLIENT_ACCESS.value
    )
    client_ids = ClientUserObjectPermission.objects.filter(
        user=user, permission=permission
    ).values_list("content_object_id", flat=True)
    return Client.objects.filter(id__in=client_ids).values_list("uuid", flat=True)


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
