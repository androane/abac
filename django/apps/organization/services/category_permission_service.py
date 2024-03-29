# -*- coding: utf-8 -*-
from typing import Optional

from organization.models.organization import CategoryUserObjectPermission
from user.models import User


def filter_objects_by_user_categories(
    queryset, user: User, field: str, permission_codename: Optional[str] = None
):
    category_ids = CategoryUserObjectPermission.objects.get_category_ids_for_user(
        user, permission_codename=permission_codename
    )
    return queryset.filter(**{f"{field}__in": category_ids})
