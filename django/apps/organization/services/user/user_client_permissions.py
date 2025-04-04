# -*- coding: utf-8 -*-
from typing import Iterable

from django.contrib.auth.models import Permission
from guardian.shortcuts import assign_perm, remove_perm

from organization.models.client import Client, ClientUserObjectPermission
from organization.models.organization import Organization
from user.models import User


def update_user_client_permissions(
    org: Organization, user_uuid: str, client_uuids: list[str]
) -> User:
    user: User = org.users.get(uuid=user_uuid)

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
        permission = Permission.objects.get(codename="view_client")
        ClientUserObjectPermission.objects.bulk_create(
            [
                ClientUserObjectPermission(
                    user=user, content_object_id=client_id, permission=permission
                )
            ]
            for client_id in new_client_ids
        )

    return user


def toggle_user_client_permission(
    org: Organization, user_uuid: str, client_uuid: str
) -> User:
    user: User = org.users.get(uuid=user_uuid)

    client = org.clients.get(uuid=client_uuid)

    perm = Client.VIEW_PERMISSION_CODENAME

    if user.has_perm(perm, client):
        remove_perm(perm, user, client)
    else:
        assign_perm(perm, user, client)

    return user


def get_user_clients(user: User) -> Iterable[Client]:
    permission = Permission.objects.get(codename=Client.VIEW_PERMISSION_CODENAME)
    client_ids = ClientUserObjectPermission.objects.filter(
        user=user, permission=permission
    ).values_list("content_object_id", flat=True)
    return Client.objects.filter(id__in=client_ids)
