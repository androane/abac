# -*- coding: utf-8 -*-
import graphene

from organization.graphene.mutations import (
    CreateClientFiles,
    DeleteClient,
    DeleteClientFile,
    DeleteClientInvoiceItem,
    DeleteClientUser,
    DeleteOrganizationService,
    UpdateClient,
    UpdateClientInvoiceItem,
    UpdateClientInvoiceStatus,
    UpdateClientUser,
    UpdateOrganizationService,
)
from organization.graphene.types import (
    ClientFileType,
    ClientType,
    InvoiceType,
    StandardInvoiceItemType,
)
from organization.services.client_files_service import get_client_files
from organization.services.client_invoice_service import get_client_invoice
from organization.services.client_service import get_client, get_clients
from organization.services.client_users_service import (
    get_client_program_managers,
    get_client_users,
)
from organization.services.organization_invoice_service import get_organization_services
from user.decorators import logged_in_user_required
from user.graphene.types import UserType
from user.models import User


class Query(graphene.ObjectType):
    class Meta:
        abstract = True

    clients = graphene.List(
        graphene.NonNull(ClientType),
        required=True,
        description="List all Clients",
    )
    client = graphene.Field(
        graphene.NonNull(ClientType),
        description="Get an individual Client",
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
    organization_services = graphene.List(
        graphene.NonNull(StandardInvoiceItemType),
        description="List all Services (Standard Invoice Items) for an organization",
        required=True,
    )

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

    @logged_in_user_required
    def resolve_organization_services(info, user: User, **kwargs):
        return get_organization_services(user.organization, **kwargs)


class Mutation(graphene.ObjectType):
    update_client = UpdateClient.Field(description="Update or Create a New Client")
    delete_client = DeleteClient.Field(description="Delete a Client")
    update_client_invoice_status = UpdateClientInvoiceStatus.Field(
        description="Update Client Invoice Status"
    )
    update_client_invoice_item = UpdateClientInvoiceItem.Field(
        description="Update or Create a New Client Invoice Item"
    )
    delete_client_invoice_item = DeleteClientInvoiceItem.Field(
        description="Delete a Client Invoice Item"
    )
    create_client_files = CreateClientFiles.Field(description="Create new Client Files")
    delete_client_file = DeleteClientFile.Field(description="Delete a Client File")
    update_client_user = UpdateClientUser.Field(
        description="Update or Create a New Client User"
    )
    delete_client_user = DeleteClientUser.Field(description="Delete a Client User")
    update_organization_service = UpdateOrganizationService.Field(
        description="Update or Create a New Service (Standard Invoice Item)"
    )
    delete_organization_service = DeleteOrganizationService.Field(
        description="Delete an Organization Service (Standard Invoice Item)"
    )
