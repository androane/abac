# -*- coding: utf-8 -*-
from organization.graphene.types.client_types import ClientSolutionInput
from organization.models.client import ClientSolution
from organization.models.organization import Organization


def update_client_solution(
    org: Organization,
    client_uuid: str,
    client_solution_input: ClientSolutionInput,
) -> ClientSolution:
    client = org.clients.get(uuid=client_uuid)

    client_solution = ClientSolution.objects.get(
        client=client,
        uuid=client_solution_input.uuid,
    )
    client_solution.quantity = client_solution_input.quantity
    client_solution.save()

    return client_solution
