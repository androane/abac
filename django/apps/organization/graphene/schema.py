# -*- coding: utf-8 -*-
import graphene

from organization.graphene.mutations import (
    CreateClientFiles,
    DeleteClient,
    DeleteClientActivity,
    DeleteClientFile,
    DeleteClientUser,
    DeleteOrganizationActivity,
    DeleteOrganizationSolution,
    UpdateClient,
    UpdateClientActivity,
    UpdateClientInvoiceStatus,
    UpdateClientUser,
    UpdateOrganizationActivity,
    UpdateOrganizationSolution,
)
from organization.graphene.types import (
    ClientFileType,
    ClientType,
    InvoiceType,
    OrganizationType,
)
from organization.services.client_files_service import get_client_files
from organization.services.client_invoice_service import get_client_invoice
from organization.services.client_service import get_client, get_clients
from organization.services.client_users_service import (
    get_client_program_managers,
    get_client_users,
)
from user.decorators import logged_in_user_required
from user.graphene.types import UserType
from user.models import User


class Query(graphene.ObjectType):
    class Meta:
        abstract = True

    organization = graphene.Field(
        graphene.NonNull(OrganizationType),
        description="Get an Organization",
    )
    clients = graphene.List(
        graphene.NonNull(ClientType),
        required=True,
        description="List all Clients",
    )
    client = graphene.Field(
        graphene.NonNull(ClientType),
        description="Get a Client",
        uuid=graphene.String(required=True),
    )
    client_invoice = graphene.Field(
        graphene.NonNull(InvoiceType),
        client_uuid=graphene.String(required=True),
        month=graphene.Int(),
        year=graphene.Int(),
    )
    client_files = graphene.List(
        graphene.NonNull(ClientFileType),
        description="List all files of a Client",
        client_uuid=graphene.String(required=True),
        required=True,
    )
    client_program_managers = graphene.List(
        graphene.NonNull(UserType),
        description="List all Program Managers",
        required=True,
    )
    client_users = graphene.List(
        graphene.NonNull(UserType),
        description="List all Client Users",
        client_uuid=graphene.String(required=True),
        required=True,
    )

    @logged_in_user_required
    def resolve_organization(info, user: User, **kwargs):
        return user.organization

    @logged_in_user_required
    def resolve_clients(info, user: User, **kwargs):
        return get_clients(user.organization, **kwargs)

    @logged_in_user_required
    def resolve_client(info, user: User, **kwargs):
        return get_client(user.organization, **kwargs)

    @logged_in_user_required
    def resolve_client_invoice(info, user: User, **kwargs):
        return get_client_invoice(user.organization, **kwargs)

    @logged_in_user_required
    def resolve_client_files(info, user: User, **kwargs):
        return get_client_files(user.organization, **kwargs)

    @logged_in_user_required
    def resolve_client_program_managers(info, user: User, **kwargs):
        return get_client_program_managers(user.organization)

    @logged_in_user_required
    def resolve_client_users(info, user: User, **kwargs):
        return get_client_users(user.organization, **kwargs)


class Mutation(graphene.ObjectType):
    # Organization Activity
    update_organization_activity = UpdateOrganizationActivity.Field(
        description="Update or Create a New Activity"
    )
    delete_organization_activity = DeleteOrganizationActivity.Field(
        description="Delete an Organization Activity"
    )

    # Organization Solution
    update_organization_solution = UpdateOrganizationSolution.Field(
        description="Update or Create a New Solution"
    )
    delete_organization_solution = DeleteOrganizationSolution.Field(
        description="Delete an Organization Solution"
    )

    # Client
    update_client = UpdateClient.Field(description="Update or Create a New Client")
    delete_client = DeleteClient.Field(description="Delete a Client")

    # Client Invoice
    update_client_invoice_status = UpdateClientInvoiceStatus.Field(
        description="Update Client Invoice Status"
    )

    # Client Activity
    update_client_activity = UpdateClientActivity.Field(
        description="Update or Create a New Client Invoice Item"
    )
    delete_client_activity = DeleteClientActivity.Field(
        description="Delete a Client Invoice Item"
    )

    # Client File
    create_client_files = CreateClientFiles.Field(description="Create new Client Files")
    delete_client_file = DeleteClientFile.Field(description="Delete a Client File")

    # Client User
    update_client_user = UpdateClientUser.Field(
        description="Update or Create a New Client User"
    )
    delete_client_user = DeleteClientUser.Field(description="Delete a Client User")
