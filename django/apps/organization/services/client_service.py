# -*- coding: utf-8 -*-
from typing import Optional

from django.contrib.auth import get_user_model
from django.db.models import QuerySet

from organization.models import Client, Organization


def get_clients(org: Organization) -> QuerySet[Client]:
    return org.clients.order_by("name").all()


def get_client(org: Organization, uuid: str) -> Client:
    return org.clients.get(uuid=uuid)


def update_or_create_client(
    org: Organization,
    name: str,
    uuid: Optional[str] = None,
    description: Optional[str] = None,
    phone_number_1: Optional[str] = "",
    phone_number_2: Optional[str] = "",
    program_manager_uuid: Optional[str] = None,
    spv_username: Optional[str] = None,
    spv_password: Optional[str] = None,
    cui: Optional[str] = None,
) -> None:
    program_manager = None
    if program_manager_uuid:
        program_manager = get_user_model().objects.get(
            is_staff=False, uuid=program_manager_uuid
        )

    if uuid:
        client = Client.objects.get(uuid=uuid, organization=org)
    else:
        client = Client(organization=org)

    client.name = name
    client.description = description
    client.phone_number_1 = phone_number_1
    client.phone_number_2 = phone_number_2
    client.program_manager = program_manager
    client.spv_username = spv_username
    client.spv_password = spv_password
    client.cui = cui
    client.save()

    return client


def delete_client(org: Organization, client_uuid: str) -> None:
    org.clients.get(uuid=client_uuid).delete()
