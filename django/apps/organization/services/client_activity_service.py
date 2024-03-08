# -*- coding: utf-8 -*-
from django.db.models import F

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
    activity_uuid: str,
    client_activity_input: ClientActivityInput,
) -> None:
    client = org.clients.get(uuid=client_uuid)

    if client_activity_input.uuid:
        ClientActivity.objects.filter(
            client=client,
            client__organization=org,
            uuid=client_activity_input.uuid,
        ).update(is_executed=~F("is_executed"))
        return client_activity_input.uuid

    activity = org.activities.get(uuid=activity_uuid, client__isnull=True)
    activity.id = None
    activity.client = client
    activity.save()
    activity.refresh_from_db()

    client_activity = ClientActivity.objects.create(
        client=client,
        activity=activity,
        is_executed=client_activity_input.is_executed,
        month=client_activity_input.month,
        year=client_activity_input.year,
    )
    return client_activity.uuid
