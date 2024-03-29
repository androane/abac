# -*- coding: utf-8 -*-
from typing import Iterable

from organization.graphene.types import ActivityInput
from organization.models import Activity, Organization, OrganizationBusinessCategory
from organization.services.category_permission_service import (
    filter_objects_by_user_categories,
)
from user.models import User


def get_organization_activities(user: User) -> Iterable[Activity]:
    qs = user.organization.activities.filter(
        client__isnull=True,
    )

    return filter_objects_by_user_categories(qs, user, "category_id")


def update_organization_activity(
    organization: Organization, activity_input: ActivityInput
) -> Activity:
    if activity_input.uuid:
        activity = organization.activities.get(
            client__isnull=True, uuid=activity_input.uuid
        )
    else:
        category = OrganizationBusinessCategory.objects.get(
            code=activity_input.category_code
        )
        activity = Activity(
            organization=organization,
            category=category,
        )

    attrs = (
        "name",
        "description",
        "unit_cost",
        "unit_cost_currency",
        "unit_cost_type",
    )

    for attr in attrs:
        value = getattr(activity_input, attr)
        if value:
            setattr(activity, attr, value)

    activity.save()
    return activity


def delete_organization_activity(organization: Organization, uuid: str) -> None:
    organization.activities.get(uuid=uuid).delete()
