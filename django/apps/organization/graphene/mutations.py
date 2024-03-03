# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation
from organization.graphene.types import (
    ActivityInput,
    ActivityType,
    ClientActivityInput,
    ClientActivityType,
    ClientFileInput,
    ClientType,
    ClientUserInput,
    InvoiceStatusEnumType,
    InvoiceType,
    SolutionInput,
    SolutionType,
)
from organization.services.client_activity_service import (
    delete_client_activity,
    update_client_activity,
)
from organization.services.client_files_service import (
    create_client_files,
    delete_client_file,
)
from organization.services.client_invoice_service import update_client_invoice_status
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
from user.decorators import logged_in_user_required
from user.graphene.types import UserType
from user.models import User


class UpdateClient(BaseMutation):
    class Arguments:
        uuid = graphene.String()
        name = graphene.String(required=True)
        description = graphene.String()
        phone_number_1 = graphene.String()
        phone_number_2 = graphene.String()
        program_manager_uuid = graphene.String()
        spv_username = graphene.String()
        spv_password = graphene.String()
        cui = graphene.String()

    client = graphene.Field(ClientType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        client = update_or_create_client(user.organization, **kwargs)

        return {
            "client": client,
        }


class DeleteClient(BaseMutation):
    class Arguments:
        client_uuid = graphene.String(required=True)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        delete_client(user.organization, **kwargs)

        return {}


class UpdateClientInvoiceStatus(BaseMutation):
    class Arguments:
        invoice_uuid = graphene.String(required=True)
        status = InvoiceStatusEnumType(required=True)

    invoice = graphene.Field(InvoiceType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        invoice = update_client_invoice_status(user.organization, **kwargs)

        return {
            "invoice": invoice,
        }


class UpdateClientActivity(BaseMutation):
    class Arguments:
        client_uuid = graphene.String(required=True)
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
        activity_uuid = graphene.String(required=True)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        delete_client_activity(user.organization, **kwargs)

        return {}


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


class UpdateOrganizationActivity(BaseMutation):
    class Arguments:
        activity_input = graphene.NonNull(ActivityInput)

    activity = graphene.Field(ActivityType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        activity = update_activity(user.organization, **kwargs)

        return {
            "activity": activity,
        }


class DeleteOrganizationActivity(BaseMutation):
    class Arguments:
        uuid = graphene.String(required=True)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        delete_activity(user.organization, **kwargs)

        return {}


class UpdateOrganizationSolution(BaseMutation):
    class Arguments:
        solution_input = graphene.NonNull(SolutionInput)

    solution = graphene.Field(SolutionType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        solution = update_solution(user.organization, **kwargs)

        return {
            "solution": solution,
        }


class DeleteOrganizationSolution(BaseMutation):
    class Arguments:
        uuid = graphene.String(required=True)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        delete_solution(user.organization, **kwargs)

        return {}
