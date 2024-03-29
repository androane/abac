# -*- coding: utf-8 -*-
from typing import Iterable

from django.contrib.auth.models import Permission

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

    codename = OrganizationBusinessCategory.VIEW_PERMISSION_CODENAME

    try:
        perm = CategoryUserObjectPermission.objects.get(
            user=user, content_object=category, permission__codename=codename
        )
    except CategoryUserObjectPermission.DoesNotExist:
        permission = Permission.objects.get(codename=codename)
        CategoryUserObjectPermission.objects.create(
            user=user, content_object=category, permission=permission
        )
    else:
        perm.delete()

    return user


def get_user_categories(user: User) -> Iterable[OrganizationBusinessCategory]:
    permission_cdename = OrganizationBusinessCategory.VIEW_PERMISSION_CODENAME

    client_ids = CategoryUserObjectPermission.objects.get_category_ids_for_user(
        user, permission_cdename
    )

    return OrganizationBusinessCategory.objects.filter(id__in=client_ids)
