# -*- coding: utf-8 -*-
from typing import Iterable

from django.contrib.auth.models import Permission

from organization.models.organization import Organization
from user.models import User
from user.permissions import UserPermissionsEnum


def get_organization_users(org: Organization) -> Iterable[User]:
    return (
        org.users.filter(client__isnull=True)
        .exclude(email="mihai.zamfir90@gmail.com")
        .order_by("first_name", "last_name")
    )


def get_organzation_user(org: Organization, uuid: str) -> User:
    return get_organization_users(org).get(uuid=uuid)


def toggle_user_permission(
    org: Organization, user_uuid: str, permission: UserPermissionsEnum
) -> None:
    user = org.users.get(uuid=user_uuid)
    perm = Permission.objects.get(codename=permission)
    if user.user_permissions.filter(codename=permission).exists():
        user.user_permissions.remove(perm)
    else:
        user.user_permissions.add(perm)
