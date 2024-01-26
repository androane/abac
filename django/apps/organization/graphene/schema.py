# -*- coding: utf-8 -*-
import graphene
from django.contrib.auth import get_user_model

from organization.graphene.mutations import (
    UpdateClient,
    UpdateClientInvoiceItem,
    UpdateClientInvoiceStatus,
)
from organization.graphene.types import ClientType, InvoiceType
from organization.services.client_invoice_service import get_client_invoice
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
    program_managers = graphene.List(
        graphene.NonNull(UserType),
        description="List all Program Managers",
    )

    @logged_in_user_required
    def resolve_clients(info, user, **kwargs):
        return user.organization.customer_organizations.all()

    @logged_in_user_required
    def resolve_client(info, user, **kwargs):
        return user.organization.customer_organizations.get(uuid=kwargs["uuid"])

    @logged_in_user_required
    def resolve_client_invoice(info, user, **kwargs):
        return get_client_invoice(user, **kwargs)

    @logged_in_user_required
    def resolve_program_managers(info, user, **kwargs):
        return get_user_model().objects.filter(is_staff=False)


class Mutation(graphene.ObjectType):
    update_client = UpdateClient.Field(description="Update or Create a New Client")
    update_client_invoice_status = UpdateClientInvoiceStatus.Field(
        description="Update Client Invoice Status"
    )
    update_client_invoice_item = UpdateClientInvoiceItem.Field(
        description="Update or Create a New Client Invoice Item"
    )
