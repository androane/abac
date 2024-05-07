# -*- coding: utf-8 -*-
import pendulum
from django.db import transaction

from core.models import generate_uuid
from organization.models import ClientActivity, Organization


def clone_client_activity(
    client_activity: ClientActivity, date: pendulum.DateTime
) -> None:
    activity = client_activity.activity
    activity.pk = None
    activity.uuid = generate_uuid()
    activity.save()
    activity.refresh_from_db()

    client_activity.pk = None
    client_activity.uuid = generate_uuid()
    client_activity.year = date.year
    client_activity.month = date.month
    client_activity.is_executed = False
    client_activity.activity = activity
    client_activity.save()
    client_activity.refresh_from_db()
    return client_activity


def transfer_recurrent_client_activities(year: int, month: int) -> None:
    this_month = pendulum.datetime(year, month, 1)
    last_month = this_month.subtract(months=1)

    created_activities = []

    for org in Organization.objects.all():
        with transaction.atomic():
            for client in org.clients.iterator():
                for client_activity in client.client_activities.filter(
                    is_recurrent=True,
                    year=last_month.year,
                    month=last_month.month,
                ).select_related("activity"):
                    client_activity = clone_client_activity(client_activity, last_month)
                    created_activities.append(client_activity)

    print(created_activities)
