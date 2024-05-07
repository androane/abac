# -*- coding: utf-8 -*-
from typing import Optional

from organization.models.organization import CategoryUserObjectPermission
from user.models import User
from user.permissions import UserPermissionsEnum


def get_category_ids_for_user(
    user: "User", permission_codename: Optional[str] = None
) -> list[str]:
    if user.has_perm(f"user.{UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value}"):
        return list(user.organization.categories.values_list("id", flat=True))

    qs = CategoryUserObjectPermission.objects.filter(user=user)

    if permission_codename and not user.has_perm(
        f"user.{UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value}"
    ):
        qs = qs.filter(permission__codename=permission_codename)

    return list(qs.values_list("content_object_id", flat=True))
