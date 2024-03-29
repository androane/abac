# -*- coding: utf-8 -*-
from typing import Iterable

from django.contrib.auth.models import Permission

from organization.models.organization import (
    CategoryUserObjectPermission,
    Organization,
    OrganizationBusinessCategory,
)
from organization.services.category_permission_service import (
    filter_objects_by_user_categories,
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
    permission_codename = OrganizationBusinessCategory.VIEW_PERMISSION_CODENAME
    return filter_objects_by_user_categories(
        OrganizationBusinessCategory.objects,
        user,
        "id",
        permission_codename=permission_codename,
    )
