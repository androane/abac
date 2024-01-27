# -*- coding: utf-8 -*-
from typing import Optional

from django.contrib.auth import get_user_model
from django.db.models import QuerySet

from organization.models import CustomerOrganization
from user.models import User


def get_clients(user: User) -> QuerySet[CustomerOrganization]:
    return user.organization.customer_organizations.all()


def get_client(user: User, uuid: str) -> CustomerOrganization:
    return user.organization.customer_organizations.get(uuid=uuid)


def update_or_create_client(
    user: User,
    name: str,
    uuid: Optional[str] = None,
    description: Optional[str] = None,
    phone_number_1: Optional[str] = "",
    phone_number_2: Optional[str] = "",
    program_manager_uuid: Optional[str] = None,
) -> None:
    program_manager = None
    if program_manager_uuid:
        program_manager = get_user_model().objects.get(
            is_staff=False, uuid=program_manager_uuid
        )

    if uuid:
        client = CustomerOrganization.objects.get(
            uuid=uuid, organization=user.organization
        )
    else:
        client = CustomerOrganization(organization=user.organization)

    client.name = name
    client.description = description
    client.phone_number_1 = phone_number_1
    client.phone_number_2 = phone_number_2
    client.program_manager = program_manager
    client.save()
    return client
