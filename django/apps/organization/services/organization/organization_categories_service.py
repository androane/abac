# -*- coding: utf-8 -*-
from typing import Iterable

from organization.models.organization import OrganizationBusinessCategory
from organization.services.category_permission_service import get_category_ids_for_user
from user.models import User


def get_organization_categories(user: User) -> Iterable[OrganizationBusinessCategory]:
    return user.organization.categories.filter(id__in=get_category_ids_for_user(user))
