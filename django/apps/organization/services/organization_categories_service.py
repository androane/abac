# -*- coding: utf-8 -*-
from typing import Iterable

from organization.models.organization import (
    CategoryUserObjectPermission,
    OrganizationBusinessCategory,
)
from user.models import User


def get_organization_categories(user: User) -> Iterable[OrganizationBusinessCategory]:
    category_ids = CategoryUserObjectPermission.objects.filter(
        user=user,
    ).values_list("content_object__id", flat=True)

    return user.organization.categories.filter(id__in=category_ids)
