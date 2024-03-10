# -*- coding: utf-8 -*-
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


def get_client_activity(
    org: Organization,
    client_activity_uuid: str,
) -> ClientActivity:
    return ClientActivity.objects.get(
        client__organization=org,
        uuid=client_activity_uuid,
    )


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

    existing_log_uuids = set(client_activity.logs.values_list("uuid", flat=True))
    input_log_uuids = set([_.uuid for _ in client_activity_logs_input])

    to_delete = existing_log_uuids - input_log_uuids
    if to_delete:
        ClientActivityLog.objects.filter(uuid__in=to_delete).delete()

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
