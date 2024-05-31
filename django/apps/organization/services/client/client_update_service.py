# -*- coding: utf-8 -*-
from typing import TYPE_CHECKING

import pendulum
from django.contrib.auth import get_user_model

from api.errors import CLIENT_ALREADY_EXISTS, APIException
from core.exceptions import PermissionException
from organization.models import Client, ClientSolution
from organization.models.activity import Solution
from organization.models.client import ClientSoftware
from organization.services.category_permission_service import get_category_ids_for_user
from user.models import User
from user.permissions import UserPermissionsEnum, validate_has_permission

if TYPE_CHECKING:
    from organization.graphene.types import ClientInput


def _set_client_general_information(
    client: Client, client_input: "ClientInput"
) -> None:
    program_manager = None
    if client_input.program_manager_uuid:
        program_manager = get_user_model().objects.get(
            is_staff=False, uuid=client_input.program_manager_uuid
        )

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
            setattr(client, field, value.strip())

    client.save()


def _set_client_solutions(
    user: User, client: Client, client_input: "ClientInput"
) -> None:
    input_client_solution_uuids = set([_.uuid for _ in client_input.client_solutions])

    # Delete objects that were no longer passed in
    client_solutions = client.client_solutions.exclude(
        uuid__in=input_client_solution_uuids
    ).filter(
        month__isnull=True,
        year__isnull=True,
    )
    client_solutions.filter(
        solution__category_id__in=get_category_ids_for_user(user)
    ).delete()

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
            # The ClientSolution update should reflect on the current month too
            client.client_solutions.filter(
                solution=solution,
                year=pendulum.now().year,
                month=pendulum.now().month,
            ).update(
                unit_cost=client_solution_input.unit_cost,
                unit_cost_currency=client_solution_input.unit_cost_currency,
            )
        else:
            ClientSolution.objects.create(
                client=client,
                solution=solution,
                unit_cost=client_solution_input.unit_cost or 0,
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

    if client_input.uuid:
        client = org.clients.get(uuid=client_input.uuid)
    else:
        if org.clients.filter(name=client_input.name.strip()).exists():
            raise APIException(CLIENT_ALREADY_EXISTS)
        client = Client(organization=org)

    try:
        validate_has_permission(user, UserPermissionsEnum.HAS_CLIENT_ADD_ACCESS.value)
    except PermissionException:
        pass
    else:
        _set_client_general_information(client, client_input)
        _set_client_solutions(user, client, client_input)

    _set_client_softwares(client, client_input)

    return client
