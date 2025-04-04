# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation
from api.permission_decorators import permission_required
from organization.services.user.user_category_permissions import (
    toggle_user_category_permission,
)
from organization.services.user.user_client_permissions import (
    toggle_user_client_permission,
    update_user_client_permissions,
)
from organization.services.user.user_generic_permissions import toggle_user_permission
from user.decorators import logged_in_user_required
from user.graphene.types import UserPermissionsEnumType, UserType
from user.models import User
from user.permissions import UserPermissionsEnum


class ToggleUserPermission(BaseMutation):
    class Arguments:
        user_uuid = graphene.String(required=True)
        permission = UserPermissionsEnumType(required=True)

    user = graphene.NonNull(UserType)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value)
    def mutate(self, user: User, **kwargs):
        target_user = toggle_user_permission(user.organization, **kwargs)

        return {"user": target_user}


# NOT USED, THE TOGGLE IS USED INSTEAD
class UpdateUserClientPermissions(BaseMutation):
    class Arguments:
        user_uuid = graphene.String(required=True)
        client_uuids = graphene.List(graphene.NonNull(graphene.String), required=True)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value)
    def mutate(self, user: User, **kwargs):
        update_user_client_permissions(user.organization, **kwargs)

        return {}


class ToggleUserClientPermission(BaseMutation):
    class Arguments:
        user_uuid = graphene.String(required=True)
        client_uuid = graphene.NonNull(graphene.String)

    user = graphene.NonNull(UserType)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value)
    def mutate(self, user: User, **kwargs):
        target_user = toggle_user_client_permission(user.organization, **kwargs)

        return {"user": target_user}


class ToggleUserCategoryPermission(BaseMutation):
    class Arguments:
        user_uuid = graphene.String(required=True)
        category_uuid = graphene.NonNull(graphene.String)

    user = graphene.NonNull(UserType)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value)
    def mutate(self, user: User, **kwargs):
        target_user = toggle_user_category_permission(user.organization, **kwargs)

        return {"user": target_user}
