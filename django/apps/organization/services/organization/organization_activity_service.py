# -*- coding: utf-8 -*-
from typing import Iterable

from organization.graphene.types import ActivityInput
from organization.models import Activity, Organization, OrganizationBusinessCategory
from organization.services.category_permission_service import get_category_ids_for_user
from user.models import User


def get_organization_activities(
    user: User, exclude_solution_activities: bool = False
) -> Iterable[Activity]:
    activities = user.organization.activities.filter(
        client__isnull=True,
        category_id__in=get_category_ids_for_user(user),
    )

    if exclude_solution_activities:
        activities = activities.filter(solutions__isnull=True)
    return activities


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
