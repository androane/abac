# -*- coding: utf-8 -*-
from typing import Iterable

from organization.graphene.types import SolutionInput
from organization.models import Organization, OrganizationBusinessCategory, Solution
from organization.models.organization import CategoryUserObjectPermission
from user.models import User


def get_organization_solutions(user: User) -> Iterable[Solution]:
    category_ids = CategoryUserObjectPermission.objects.get_category_ids_for_user(
        user,
    )

    return user.organization.solutions.filter(category_id__in=category_ids)


def update_organization_solution(
    organization: Organization, solution_input: SolutionInput
) -> Solution:
    if solution_input.uuid:
        solution = organization.solutions.get(uuid=solution_input.uuid)
    else:
        category = OrganizationBusinessCategory.objects.get(
            code=solution_input.category_code
        )
        solution = Solution(organization=organization, category=category)

    attrs = ("name",)

    for attr in attrs:
        value = getattr(solution_input, attr)
        if value:
            setattr(solution, attr, value)

    solution.save()

    solution.activities.clear()
    solution.activities.set(
        list(organization.activities.filter(uuid__in=solution_input.activity_uuids))
    )

    return solution


def delete_organization_solution(organization: Organization, uuid: str) -> None:
    organization.solutions.get(uuid=uuid).delete()
