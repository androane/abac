# -*- coding: utf-8 -*-
from organization.graphene.types import SolutionInput
from organization.models import Organization, OrganizationBusinessCategory, Solution


def update_solution(
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


def delete_solution(organization: Organization, uuid: str) -> None:
    organization.solutions.get(uuid=uuid).delete()
