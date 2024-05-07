# -*- coding: utf-8 -*-
from typing import Iterable

from guardian.shortcuts import assign_perm, remove_perm

from organization.models.organization import Organization, OrganizationBusinessCategory
from organization.services.category_permission_service import get_category_ids_for_user
from user.models import User


def toggle_user_category_permission(
    org: Organization, user_uuid: str, category_uuid: str
) -> User:
    target_user: User = org.users.get(uuid=user_uuid)

    category = org.categories.get(uuid=category_uuid)

    perm = OrganizationBusinessCategory.VIEW_PERMISSION_CODENAME

    if target_user.has_perm(perm, category):
        remove_perm(perm, target_user, category)
    else:
        assign_perm(perm, target_user, category)

    return target_user


def get_user_categories(user: User) -> Iterable[OrganizationBusinessCategory]:
    permission_codename = OrganizationBusinessCategory.VIEW_PERMISSION_CODENAME
    return OrganizationBusinessCategory.objects.filter(
        id__in=get_category_ids_for_user(user, permission_codename)
    )
