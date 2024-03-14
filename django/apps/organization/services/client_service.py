# -*- coding: utf-8 -*-
from django.contrib.auth import get_user_model

from organization.graphene.types import ClientInput
from organization.models import Client, ClientSolution, Organization
from organization.models.activity import Solution


def get_client(org: Organization, uuid: str) -> Client:
    return org.clients.get(uuid=uuid)


def update_or_create_client(org: Organization, client_input: ClientInput) -> Client:
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

    input_client_solution_uuids = set([_.uuid for _ in client_input.client_solutions])
    client.client_solutions.exclude(uuid__in=input_client_solution_uuids).delete()

    for client_solution_input in client_input.client_solutions:
        # These are optional fields in the frontend for now
        if (
            not client_solution_input.solution_uuid
            or not client_solution_input.unit_cost
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

    return client


def delete_client(org: Organization, client_uuid: str) -> None:
    org.clients.get(uuid=client_uuid).delete()
