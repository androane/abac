# -*- coding: utf-8 -*-
from organization.graphene.types import LogInput
from organization.models import ClientActivity, ClientActivityLog, Organization
from organization.models.client import ClientSolution, ClientSolutionLog


def update_client_activity_logs(
    org: Organization,
    client_activity_uuid: str,
    logs_input: list[LogInput],
) -> ClientActivity:
    client_activity = ClientActivity.objects.get(
        uuid=client_activity_uuid, client__organization=org
    )

    input_log_uuids = set([_.uuid for _ in logs_input])
    ClientActivityLog.objects.exclude(uuid__in=input_log_uuids).delete()

    for log_input in logs_input:
        if log_input.uuid:
            ClientActivityLog.objects.filter(
                uuid=log_input.uuid, client_activity=client_activity
            ).update(
                minutes_allocated=log_input.minutes_allocated,
                date=log_input.date,
                description=log_input.description,
            )
        else:
            ClientActivityLog.objects.create(
                client_activity=client_activity,
                minutes_allocated=log_input.minutes_allocated,
                date=log_input.date,
                description=log_input.description,
            )

    return client_activity


def update_client_solution_logs(
    org: Organization,
    client_solution_uuid: str,
    logs_input: list[LogInput],
) -> ClientActivity:
    client_solution = ClientSolution.objects.get(
        uuid=client_solution_uuid, client__organization=org
    )

    input_log_uuids = set([_.uuid for _ in logs_input])
    ClientSolutionLog.objects.exclude(uuid__in=input_log_uuids).delete()

    for log_input in logs_input:
        if log_input.uuid:
            ClientSolutionLog.objects.filter(
                uuid=log_input.uuid, client_solution=client_solution
            ).update(
                minutes_allocated=log_input.minutes_allocated,
                date=log_input.date,
                description=log_input.description,
            )
        else:
            ClientSolutionLog.objects.create(
                client_solution=client_solution,
                minutes_allocated=log_input.minutes_allocated,
                date=log_input.date,
                description=log_input.description,
            )

    return client_solution
