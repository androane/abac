# -*- coding: utf-8 -*-
from typing import Iterable

from organization.models.organization import OrganizationBusinessCategory
from organization.services.category_permission_service import (
    filter_objects_by_user_categories,
)
from user.models import User


def get_organization_categories(user: User) -> Iterable[OrganizationBusinessCategory]:
    return filter_objects_by_user_categories(user.organization.categories, user, "id")
