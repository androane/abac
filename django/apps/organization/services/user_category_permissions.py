# -*- coding: utf-8 -*-
from typing import Iterable

from django.contrib.auth.models import Permission
from guardian.shortcuts import assign_perm, remove_perm

from organization.models.organization import (
    CategoryUserObjectPermission,
    Organization,
    OrganizationBusinessCategory,
)
from user.models import User


def toggle_user_category_permission(
    org: Organization, user_uuid: str, category_uuid: str
) -> User:
    user: User = org.users.get(uuid=user_uuid)

    category = org.categories.get(uuid=category_uuid)

    perm = OrganizationBusinessCategory.VIEW_PERMISSION_CODENAME

    if user.has_perm(perm, category):
        remove_perm(perm, user, category)
    else:
        assign_perm(perm, user, category)

    return user


def get_user_category_permissions(user: User) -> Iterable[OrganizationBusinessCategory]:
    permission = Permission.objects.get(
        codename=OrganizationBusinessCategory.VIEW_PERMISSION_CODENAME
    )
    client_ids = CategoryUserObjectPermission.objects.filter(
        user=user, permission=permission
    ).values_list("content_object_id", flat=True)
    return OrganizationBusinessCategory.objects.filter(id__in=client_ids)
