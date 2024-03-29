# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation
from api.permission_decorators import permission_required
from organization.graphene.types import (
    ActivityInput,
    ActivityType,
    SolutionInput,
    SolutionType,
)
from organization.services.organization_activity_service import (
    delete_organization_activity,
    update_organization_activity,
)
from organization.services.organization_solution_service import (
    delete_organization_solution,
    update_organization_solution,
)
from user.decorators import logged_in_user_required
from user.models import User
from user.permissions import UserPermissionsEnum


class UpdateOrganizationActivity(BaseMutation):
    class Arguments:
        activity_input = graphene.NonNull(ActivityInput)

    activity = graphene.Field(ActivityType)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_SETTINGS_ACCESS.value)
    def mutate(self, user: User, **kwargs):
        activity = update_organization_activity(user.organization, **kwargs)

        return {
            "activity": activity,
        }


class DeleteOrganizationActivity(BaseMutation):
    class Arguments:
        uuid = graphene.String(required=True)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_SETTINGS_ACCESS.value)
    def mutate(self, user: User, **kwargs):
        delete_organization_activity(user.organization, **kwargs)

        return {}


class UpdateOrganizationSolution(BaseMutation):
    class Arguments:
        solution_input = graphene.NonNull(SolutionInput)

    solution = graphene.Field(SolutionType)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_SETTINGS_ACCESS.value)
    def mutate(self, user: User, **kwargs):
        solution = update_organization_solution(user.organization, **kwargs)

        return {
            "solution": solution,
        }


class DeleteOrganizationSolution(BaseMutation):
    class Arguments:
        uuid = graphene.String(required=True)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_SETTINGS_ACCESS.value)
    def mutate(self, user: User, **kwargs):
        delete_organization_solution(user.organization, **kwargs)

        return {}
