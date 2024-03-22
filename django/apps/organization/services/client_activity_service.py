# -*- coding: utf-8 -*-
from typing import Iterable, Optional

from django.db.models import F

from core.models import generate_uuid
from organization.graphene.types import ActivityInput, ClientActivityInput
from organization.models import Activity, ActivityCategory, ClientActivity, Organization
from organization.models.client import Client, ClientSolution


def update_client_activity(
    org: Organization,
    client_uuid: str,
    activity_input: ActivityInput,
    client_activity_input: ClientActivityInput,
) -> ClientActivity:
    client = org.clients.get(uuid=client_uuid)
    category = ActivityCategory.objects.get(code=activity_input.category_code)

    def set_activity_attrs(activity: Activity):
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
            year=client_activity_input.year,
            month=client_activity_input.month,
        )
        client_activity.quantity = client_activity_input.quantity
        client_activity.save()

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
            year=client_activity_input.year,
            month=client_activity_input.month,
            quantity=client_activity_input.quantity,
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


def get_client_activities(
    client: Client, month: int, year: int
) -> Iterable[ClientActivity]:
    return client.client_activities.filter(
        month=month,
        year=year,
    )


def get_client_solutions(
    client: Client, month: Optional[int] = None, year: Optional[int] = None
) -> list[ClientSolution]:
    global_client_solutions: Iterable[ClientSolution] = client.client_solutions.filter(
        month__isnull=True, year__isnull=True
    ).all()

    # Returning the global solution for the client
    if not month and not year:
        global_client_solutions

    existing_client_solutions = {
        _.solution_id: _
        for _ in client.client_solutions.filter(
            year=year,
            month=month,
        )
    }

    client_solutions = []
    # Returning the solution for the client for the given month and year
    for global_client_solution in global_client_solutions:
        client_solution = existing_client_solutions.get(
            global_client_solution.solution_id
        )
        if not client_solution:
            client_solution = global_client_solution
            client_solution.pk = None
            client_solution.uuid = generate_uuid()
            client_solution.year = year
            client_solution.month = month
            client_solution.save()

        client_solutions.append(client_solution)
    return client_solutions
