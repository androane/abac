# -*- coding: utf-8 -*-
from typing import Iterable

from organization.models.organization import Organization
from user.models import User


def get_organization_users(org: Organization) -> Iterable[User]:
    return (
        org.users.filter(client__isnull=True)
        .exclude(email="mihai.zamfir90@gmail.com")
        .order_by("first_name", "last_name")
    )


def get_organzation_user(org: Organization, uuid: str) -> User:
    return get_organization_users(org).get(uuid=uuid)
