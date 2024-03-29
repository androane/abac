# -*- coding: utf-8 -*-
from typing import TYPE_CHECKING

from django.contrib.auth import get_user_model
from django.db.models import Q

from organization.models import Client, ClientSolution
from organization.models.activity import Solution
from organization.models.client import ClientSoftware, ClientUserObjectPermission
from organization.services.category_permission_service import (
    filter_objects_by_user_categories,
)
from user.models import User
from user.permissions import UserPermissionsEnum

if TYPE_CHECKING:
    from organization.graphene.types import ClientInput


def get_clients(user: User):
    all_clients = user.organization.clients

    permissions = user.user_permissions.values_list("codename", flat=True)
    if UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value in permissions:
        return all_clients

    if UserPermissionsEnum.HAS_ALL_CLIENTS_ACCESS.value in permissions:
        return all_clients

    client_ids = ClientUserObjectPermission.objects.filter(user=user).values_list(
        "content_object_id", flat=True
    )
    condition = Q(id__in=client_ids)

    if UserPermissionsEnum.HAS_OWN_CLIENTS_ACCESS.value in permissions:
        condition |= Q(program_manager=user)

    return all_clients.filter(condition)


def get_client(user: User, uuid: str) -> Client:
    return get_clients(user).get(uuid=uuid)


def _set_client_solutions(
    user: User, client: Client, client_input: "ClientInput"
) -> None:
    input_client_solution_uuids = set([_.uuid for _ in client_input.client_solutions])
    qs = client.client_solutions.exclude(uuid__in=input_client_solution_uuids).filter(
        month__isnull=True,
        year__isnull=True,
    )
    filter_objects_by_user_categories(qs, user, "solution__category_id").delete()

    for client_solution_input in client_input.client_solutions:
        # These are optional fields in the frontend for now
        if (
            not client_solution_input.solution_uuid
            and not client_solution_input.unit_cost
        ):
            continue
        solution = Solution.objects.get(uuid=client_solution_input.solution_uuid)
        if client_solution_input.uuid:
            client.client_solutions.filter(
                solution=solution, uuid=client_solution_input.uuid
            ).update(
                unit_cost=client_solution_input.unit_cost,
                unit_cost_currency=client_solution_input.unit_cost_currency,
            )
        else:
            ClientSolution.objects.create(
                client=client,
                solution=solution,
                unit_cost=client_solution_input.unit_cost,
                unit_cost_currency=client_solution_input.unit_cost_currency,
            )


def _set_client_softwares(client: Client, client_input: "ClientInput") -> None:
    input_software_uuids = set([_.uuid for _ in client_input.softwares])
    client.softwares.exclude(uuid__in=input_software_uuids).delete()

    for software_input in client_input.softwares:
        if software_input.uuid:
            ClientSoftware.objects.filter(
                uuid=software_input.uuid,
            ).update(
                software=software_input.software,
                username=software_input.username,
                password=software_input.password,
            )
        else:
            ClientSoftware.objects.create(
                client=client,
                software=software_input.software,
                username=software_input.username,
                password=software_input.password,
            )


def update_or_create_client(user: User, client_input: "ClientInput") -> Client:
    org = user.organization

    program_manager = None
    if client_input.program_manager_uuid:
        program_manager = get_user_model().objects.get(
            is_staff=False, uuid=client_input.program_manager_uuid
        )

    if client_input.uuid:
        client = org.clients.get(uuid=client_input.uuid)
    else:
        client = Client(organization=org)

    client.program_manager = program_manager
    fields = (
        "name",
        "description",
        "spv_username",
        "spv_password",
        "cui",
    )
    for field in fields:
        value = client_input.get(field)
        if value:
            setattr(client, field, value)

    client.save()

    _set_client_solutions(user, client, client_input)
    _set_client_softwares(client, client_input)

    return client


def delete_client(user: User, uuid: str) -> None:
    get_client(user, uuid).delete()
