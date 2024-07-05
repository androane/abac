# -*- coding: utf-8 -*-
from typing import Iterable

from django.db.models import Q

from organization.models import Client
from organization.models.client import ClientUserObjectPermission
from user.models import User
from user.permissions import UserPermissionsEnum


def _get_clients_for_client_user(user: User) -> Iterable[Client]:
    if user.client.group:
        return user.client.group.clients.all()
    return Client.objects.filter(id=user.client_id)


def _get_clients_for_pm_user(user: User) -> Iterable[Client]:
    all_clients = user.organization.clients

    permissions = user.user_permissions.values_list("codename", flat=True)
    if UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value in permissions:
        return all_clients

    if UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS.value in permissions:
        return all_clients

    client_ids = ClientUserObjectPermission.objects.filter(user=user).values_list(
        "content_object_id", flat=True
    )
    condition = Q(id__in=client_ids)

    if UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS.value in permissions:
        condition |= Q(program_manager=user)

    return all_clients.filter(condition)


def get_clients(user: User) -> Iterable[Client]:
    if user.client:
        return _get_clients_for_client_user(user)
    else:
        return _get_clients_for_pm_user(user)


def get_client(user: User, uuid: str) -> Client:
    try:
        return get_clients(user).get(uuid=uuid)
    except Client.DoesNotExist:
        raise Exception(f"Client does not exist")


def delete_client(user: User, uuid: str) -> None:
    get_client(user, uuid).delete()
