# -*- coding: utf-8 -*-
from django.contrib.auth import get_user_model
from django.db.models import QuerySet

from organization.graphene.types import ClientInput
from organization.models import Client, ClientSolution, Organization


def get_clients(org: Organization) -> QuerySet[Client]:
    return org.clients.order_by("name").all()


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

    existing_solution_uuids = set(
        ClientSolution.objects.filter(client=client).values_list(
            "solution__uuid", flat=True
        )
    )
    input_solution_uuids = set([_.solution_uuid for _ in client_input.client_solutions])

    to_delete = existing_solution_uuids - input_solution_uuids
    ClientSolution.objects.filter(client=client, solution__uuid__in=to_delete).delete()

    solution_uuid_to_id = dict(
        org.solutions.filter(uuid__in=input_solution_uuids).values("uuid", "id")
    )
    for client_solution in client_input.client_solutions:
        ClientSolution.objects.update_or_create(
            client=client,
            solution_id=solution_uuid_to_id[client_solution.solution_uuid],
            defaults={
                "unit_cost": client_solution.unit_cost,
                "currency": client_solution.currency,
            },
        )

    return client


def delete_client(org: Organization, client_uuid: str) -> None:
    org.clients.get(uuid=client_uuid).delete()
