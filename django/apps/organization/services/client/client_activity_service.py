# -*- coding: utf-8 -*-
from typing import Iterable, Optional

from django.db.models import F, Q

from core.models import generate_uuid
from organization.graphene.types import ActivityInput, ClientActivityInput
from organization.models import (
    Activity,
    ClientActivity,
    Organization,
    OrganizationBusinessCategory,
)
from organization.models.client import Client, ClientSolution
from organization.services.category_permission_service import get_category_ids_for_user
from user.models import User


def update_client_activity(
    org: Organization,
    client_uuid: str,
    activity_input: ActivityInput,
    client_activity_input: ClientActivityInput,
) -> ClientActivity:
    client = org.clients.get(uuid=client_uuid)
    category = OrganizationBusinessCategory.objects.get(
        code=activity_input.category_code
    )

    def set_activity_attrs(activity: Activity):
        attrs = (
            "name",
            "description",
            "unit_cost_currency",
            "unit_cost_type",
            "unit_cost",
        )
        for attr in attrs:
            # When attr is not in the input, it means the user doesn't see it because of permissions and so we don't want to set it to null
            if attr in activity_input:
                setattr(activity, attr, getattr(activity_input, attr))

    if client_activity_input.uuid:
        client_activity = ClientActivity.objects.get(
            client=client,
            uuid=client_activity_input.uuid,
            year=client_activity_input.year,
            month=client_activity_input.month,
        )
        client_activity.quantity = client_activity_input.quantity
        client_activity.is_recurrent = client_activity_input.is_recurrent
        client_activity.save()

        activity = client_activity.activity
        set_activity_attrs(activity)
        activity.save()
    else:
        activity = Activity(organization=org, client=client, category=category)
        set_activity_attrs(activity)
        activity.save()

        client_activity = ClientActivity.objects.create(
            is_executed=False,
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
    user: User, client: Client, month: int, year: int
) -> Iterable[ClientActivity]:
    client_activities = client.client_activities.filter(
        month=month,
        year=year,
    )
    return client_activities.filter(
        activity__category_id__in=get_category_ids_for_user(user)
    )


def get_client_solutions(
    user: User, client: Client, month: Optional[int] = None, year: Optional[int] = None
) -> list[ClientSolution]:
    assert year and month or not year and not month

    all_client_solutions = (
        client.client_solutions.filter(Q(month=None) | Q(month=month))
        & (Q(year=None) | Q(year=year))
        .filter(solution__category_id__in=get_category_ids_for_user(user))
        .all()
    )

    # global_client_solutions are the solutions that are not specific to a month or year
    # They just exist to define the client-solution connection via a price
    global_client_solutions = [
        _ for _ in all_client_solutions if _.month is None and _.year is None
    ]

    # Returning the global solutions for the client
    if not month and not year:
        return global_client_solutions

    client_solutions = [
        _ for _ in all_client_solutions if _.month == month and _.year == year
    ]

    solution_id_to_client_solution = {_.solution_id: _ for _ in client_solutions}

    result = []
    # Returning the solutions for the client for the given month and year
    for global_client_solution in global_client_solutions:
        client_solution = solution_id_to_client_solution.get(
            global_client_solution.solution_id
        )

        # Create the ClientSolution for this month if it doesn't exist
        if not client_solution:
            client_solution = global_client_solution
            client_solution.pk = None
            client_solution.uuid = generate_uuid()
            client_solution.year = year
            client_solution.month = month
            client_solution.save()

        result.append(client_solution)
    return result
