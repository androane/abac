# -*- coding: utf-8 -*-
from typing import Optional

from django.db.models import F

from organization.graphene.types import (
    ActivityInput,
    ClientActivityInput,
    ClientActivityLogInput,
)
from organization.models import (
    Activity,
    ActivityCategory,
    ClientActivity,
    ClientActivityLog,
    Organization,
)
from organization.models.client import Client, ClientSolution


def update_client_activity(
    org: Organization,
    client_uuid: str,
    activity_input: ActivityInput,
    client_activity_input: ClientActivityInput,
) -> ClientActivity:
    client = org.clients.get(uuid=client_uuid)
    category = ActivityCategory.objects.get(code=activity_input.category_code)

    def set_activity_attrs(activity):
        attrs = (
            "name",
            "description",
            "unit_cost_currency",
            "unit_cost_type",
            "unit_cost",
        )
        for attr in attrs:
            setattr(activity, attr, getattr(activity_input, attr))

    if client_activity_input.uuid:
        client_activity = ClientActivity.objects.get(
            client=client,
            uuid=client_activity_input.uuid,
            month=client_activity_input.month,
            year=client_activity_input.year,
        )
        activity = client_activity.activity
        set_activity_attrs(activity)
        activity.save()
    else:
        activity = Activity(organization=org, client=client, category=category)
        set_activity_attrs(activity)
        activity.save()

        client_activity = ClientActivity.objects.create(
            is_executed=True,
            client=client,
            activity=activity,
            month=client_activity_input.month,
            year=client_activity_input.year,
        )

    return client_activity


def delete_client_activity(org: Organization, uuid: str) -> None:
    ClientActivity.objects.get(uuid=uuid, client__organization=org).delete()


def toggle_client_activity(
    org: Organization,
    client_uuid: str,
    client_activity_uuid: str,
) -> None:
    ClientActivity.objects.filter(
        client__uuid=client_uuid,
        client__organization=org,
        uuid=client_activity_uuid,
    ).update(is_executed=~F("is_executed"))


def update_client_activity_logs(
    org: Organization,
    client_activity_uuid: str,
    client_activity_logs_input: list[ClientActivityLogInput],
) -> ClientActivity:
    client_activity = ClientActivity.objects.get(
        uuid=client_activity_uuid, client__organization=org
    )

    input_log_uuids = set([_.uuid for _ in client_activity_logs_input])
    ClientActivityLog.objects.exclude(uuid__in=input_log_uuids).delete()

    for log_input in client_activity_logs_input:
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


def get_client_solutions(client: Client, month: Optional[int], year: Optional[int]):
    global_client_solutions = client.client_solutions.filter(
        month__isnull=True, year__isnull=True
    ).all()

    # Returning the global solution for the client
    if not month and not year:
        global_client_solutions

    client_solutions = []
    # Returning the solution for the client for the given month and year
    for global_client_solution in global_client_solutions:
        try:
            client_solution = client.client_solutions.get(
                solution__category=global_client_solution.solution.category,
                month=month,
                year=year,
            )
        except ClientSolution.DoesNotExist:
            client_solution = global_client_solution
            client_solution.id = None
            client_solution.month = month
            client_solution.year = year
            client_solution.save()

        client_solutions.append(client_solution)
    return client_solutions
