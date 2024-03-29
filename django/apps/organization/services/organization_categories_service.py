# -*- coding: utf-8 -*-
from typing import Iterable

from organization.models.organization import (
    CategoryUserObjectPermission,
    OrganizationBusinessCategory,
)
from user.models import User


def get_organization_categories(user: User) -> Iterable[OrganizationBusinessCategory]:
    category_ids = CategoryUserObjectPermission.objects.get_category_ids_for_user(user)
    print("category_ids")
    print(category_ids)
    return user.organization.categories.filter(id__in=category_ids)
