# -*- coding: utf-8 -*-
import graphene

from organization.graphene.mutations import (
    CreateClientFiles,
    UpdateClient,
    UpdateClientInvoiceItem,
    UpdateClientInvoiceStatus,
)
from organization.graphene.types import ClientFileType, ClientType, InvoiceType
from organization.services.client_files_service import get_client_files
from organization.services.client_invoice_service import get_client_invoice
from organization.services.client_service import get_client, get_clients
from organization.services.client_users import get_program_managers
from user.decorators import logged_in_user_required
from user.graphene.types import UserType


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
    program_managers = graphene.List(
        graphene.NonNull(UserType),
        description="List all Program Managers",
        required=True,
    )

    @logged_in_user_required
    def resolve_clients(info, user, **kwargs):
        return get_clients(user, **kwargs)

    @logged_in_user_required
    def resolve_client(info, user, **kwargs):
        return get_client(user, **kwargs)

    @logged_in_user_required
    def resolve_client_invoice(info, user, **kwargs):
        return get_client_invoice(user, **kwargs)

    @logged_in_user_required
    def resolve_client_files(info, user, **kwargs):
        return get_client_files(user, **kwargs)

    @logged_in_user_required
    def resolve_program_managers(info, user, **kwargs):
        return get_program_managers(user)


class Mutation(graphene.ObjectType):
    update_client = UpdateClient.Field(description="Update or Create a New Client")
    update_client_invoice_status = UpdateClientInvoiceStatus.Field(
        description="Update Client Invoice Status"
    )
    update_client_invoice_item = UpdateClientInvoiceItem.Field(
        description="Update or Create a New Client Invoice Item"
    )
    create_client_files = CreateClientFiles.Field(description="Create new Client Files")
