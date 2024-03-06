# -*- coding: utf-8 -*-
from organization.graphene.types import ActivityInput, ClientActivityInput
from organization.models import Activity, ActivityCategory, ClientActivity, Organization


def get_client_activities(
    org: Organization,
    client_uuid: str,
    month: int,
    year: int,
) -> list[ClientActivity]:
    return ClientActivity.objects.filter(
        month=month, year=year, client__uuid=client_uuid, client__organization=org
    ).select_related("activity")


def update_client_activity(
    org: Organization,
    client_uuid: str,
    activity_input: ActivityInput,
    client_activity_input: ClientActivityInput,
) -> ClientActivity:
    client = org.clients.get(uuid=client_uuid)
    category = ActivityCategory.objects.get(code=activity_input.category_code)

    if activity_input.uuid:
        activity = org.activities.get(
            uuid=activity_input.uuid, is_custom=True, category=category
        )
    else:
        activity = Activity.objects.create(
            organization=org, is_custom=False, category=category
        )

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
    else:
        client_activity = ClientActivity.objects.create(
            client=client,
            activity=activity,
            month=client_activity_input.month,
            year=client_activity_input.year,
        )

    attrs = ("is_executed",)
    for attr in attrs:
        setattr(activity, attr, getattr(client_activity_input, attr))

    return client_activity


def delete_client_activity(org: Organization, activity_uuid: str) -> None:
    ClientActivity.objects.get(uuid=activity_uuid, client__organization=org).delete()
