# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation
from organization.graphene.types import (
    ActivityInput,
    ActivityType,
    ClientActivityInput,
    ClientActivityType,
    ClientFileInput,
    ClientInput,
    ClientSolutionType,
    ClientType,
    ClientUserInput,
    InvoiceStatusEnumType,
    InvoiceType,
    LogInput,
    SolutionInput,
    SolutionType,
)
from organization.services.client_activity_service import (
    delete_client_activity,
    toggle_client_activity,
    update_client_activity,
)
from organization.services.client_files_service import (
    create_client_files,
    delete_client_file,
)
from organization.services.client_invoice_service import update_client_invoice_status
from organization.services.client_logs_service import (
    update_client_activity_logs,
    update_client_solution_logs,
)
from organization.services.client_service import delete_client, update_or_create_client
from organization.services.client_users_service import (
    delete_client_user,
    update_client_user,
)
from organization.services.organization_activity_service import (
    delete_activity,
    update_activity,
)
from organization.services.organization_solution_service import (
    delete_solution,
    update_solution,
)
from organization.services.organization_user_permissions import (
    toggle_user_client_permission,
    toggle_user_permission,
    update_user_client_permissions,
)
from user.decorators import logged_in_user_required
from user.graphene.types import UserPermissionsEnumType, UserType
from user.models import User
from user.permissions import UserPermissionsEnum, permission_required


class UpdateClient(BaseMutation):
    class Arguments:
        client_input = graphene.NonNull(ClientInput)

    client = graphene.Field(ClientType)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_CLIENT_ADD_ACCESS.value)
    def mutate(self, user: User, **kwargs):
        client = update_or_create_client(user.organization, **kwargs)

        return {
            "client": client,
        }


class DeleteClient(BaseMutation):
    class Arguments:
        client_uuid = graphene.String(required=True)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value)
    def mutate(self, user: User, **kwargs):
        delete_client(user.organization, **kwargs)

        return {}


class UpdateClientInvoiceStatus(BaseMutation):
    class Arguments:
        invoice_uuid = graphene.String(required=True)
        status = InvoiceStatusEnumType(required=True)

    invoice = graphene.Field(InvoiceType)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS.value)
    def mutate(self, user: User, **kwargs):
        invoice = update_client_invoice_status(user.organization, **kwargs)

        return {
            "invoice": invoice,
        }


class UpdateClientActivity(BaseMutation):
    class Arguments:
        client_uuid = graphene.String(required=True)
        activity_input = graphene.NonNull(ActivityInput)
        client_activity_input = graphene.NonNull(ClientActivityInput)

    client_activity = graphene.Field(ClientActivityType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        client_activity = update_client_activity(user.organization, **kwargs)

        return {
            "client_activity": client_activity,
        }


class DeleteClientActivity(BaseMutation):
    class Arguments:
        uuid = graphene.String(required=True)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        delete_client_activity(user.organization, **kwargs)

        return {}


class ToggleClientActivity(BaseMutation):
    class Arguments:
        client_uuid = graphene.String(required=True)
        client_activity_uuid = graphene.String(required=True)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        toggle_client_activity(user.organization, **kwargs)

        return {}


class UpdateClientActivityLogs(BaseMutation):
    class Arguments:
        client_activity_uuid = graphene.String(required=True)
        logs_input = graphene.List(graphene.NonNull(LogInput), required=True)

    client_activity = graphene.Field(ClientActivityType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        client_activity = update_client_activity_logs(user.organization, **kwargs)

        return {"client_activity": client_activity}


class UpdateClientSolutionLogs(BaseMutation):
    class Arguments:
        client_solution_uuid = graphene.String(required=True)
        logs_input = graphene.List(graphene.NonNull(LogInput), required=True)

    client_solution = graphene.Field(ClientSolutionType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        client_solution = update_client_solution_logs(user.organization, **kwargs)

        return {"client_solution": client_solution}


class CreateClientFiles(BaseMutation):
    class Arguments:
        client_uuid = graphene.String(required=True)
        client_files_input = graphene.List(graphene.NonNull(ClientFileInput))

    client = graphene.Field(ClientType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        client = create_client_files(user.organization, **kwargs)

        return {
            "client": client,
        }


class DeleteClientFile(BaseMutation):
    class Arguments:
        file_uuid = graphene.String(required=True)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        delete_client_file(user.organization, **kwargs)

        return {}


class UpdateClientUser(BaseMutation):
    class Arguments:
        client_uuid = graphene.String(required=True)
        client_user_input = graphene.NonNull(ClientUserInput)

    client_user = graphene.Field(UserType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        client_user = update_client_user(user.organization, **kwargs)

        return {
            "client_user": client_user,
        }


class DeleteClientUser(BaseMutation):
    class Arguments:
        user_uuid = graphene.String(required=True)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        delete_client_user(user.organization, **kwargs)

        return {}


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


class UpdateOrganizationActivity(BaseMutation):
    class Arguments:
        activity_input = graphene.NonNull(ActivityInput)

    activity = graphene.Field(ActivityType)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_SETTINGS_ACCESS.value)
    def mutate(self, user: User, **kwargs):
        activity = update_activity(user.organization, **kwargs)

        return {
            "activity": activity,
        }


class DeleteOrganizationActivity(BaseMutation):
    class Arguments:
        uuid = graphene.String(required=True)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_SETTINGS_ACCESS.value)
    def mutate(self, user: User, **kwargs):
        delete_activity(user.organization, **kwargs)

        return {}


class UpdateOrganizationSolution(BaseMutation):
    class Arguments:
        solution_input = graphene.NonNull(SolutionInput)

    solution = graphene.Field(SolutionType)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_SETTINGS_ACCESS.value)
    def mutate(self, user: User, **kwargs):
        solution = update_solution(user.organization, **kwargs)

        return {
            "solution": solution,
        }


class DeleteOrganizationSolution(BaseMutation):
    class Arguments:
        uuid = graphene.String(required=True)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_SETTINGS_ACCESS.value)
    def mutate(self, user: User, **kwargs):
        delete_solution(user.organization, **kwargs)

        return {}
