# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation, get_graphene_error
from organization.graphene.types import (
    ClientFileInput,
    ClientType,
    ClientUserInput,
    InvoiceItemInput,
    InvoiceStatusEnumType,
    InvoiceType,
    StandardInvoiceItemInput,
    StandardInvoiceItemType,
)
from organization.services.client_files_service import create_client_files
from organization.services.client_invoice_service import (
    delete_client_invoice_item,
    update_client_invoice_item,
    update_client_invoice_status,
)
from organization.services.client_service import update_or_create_client
from organization.services.client_users_service import (
    delete_client_user,
    update_client_user,
)
from organization.services.organization_invoice_service import (
    delete_standard_invoice_item,
    update_standard_invoice_item,
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
        try:
            client = update_or_create_client(user.organization, **kwargs)
        except Exception as e:
            return get_graphene_error(str(e))

        return {
            "client": client,
        }


class UpdateClientInvoiceStatus(BaseMutation):
    class Arguments:
        invoice_uuid = graphene.String(required=True)
        status = InvoiceStatusEnumType(required=True)

    invoice = graphene.Field(InvoiceType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        try:
            invoice = update_client_invoice_status(user.organization, **kwargs)
        except Exception as e:
            return get_graphene_error(str(e))

        return {
            "invoice": invoice,
        }


class UpdateClientInvoiceItem(BaseMutation):
    class Arguments:
        invoice_uuid = graphene.String(required=True)
        invoice_item_input = graphene.NonNull(InvoiceItemInput)

    invoice = graphene.Field(InvoiceType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        try:
            invoice = update_client_invoice_item(user.organization, **kwargs)
        except Exception as e:
            return get_graphene_error(str(e))

        return {
            "invoice": invoice,
        }


class DeleteClientInvoiceItem(BaseMutation):
    class Arguments:
        invoice_item_uuid = graphene.String(required=True)

    invoice = graphene.Field(InvoiceType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        try:
            delete_client_invoice_item(user.organization, **kwargs)
        except Exception as e:
            return get_graphene_error(str(e))

        return {}


class CreateClientFiles(BaseMutation):
    class Arguments:
        client_uuid = graphene.String(required=True)
        client_files_input = graphene.List(graphene.NonNull(ClientFileInput))

    client = graphene.Field(ClientType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        try:
            client = create_client_files(user.organization, **kwargs)
        except Exception as e:
            return get_graphene_error(str(e))

        return {
            "client": client,
        }


class UpdateClientUser(BaseMutation):
    class Arguments:
        client_uuid = graphene.String(required=True)
        client_user_input = graphene.NonNull(ClientUserInput)

    client_user = graphene.Field(UserType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        try:
            client_user = update_client_user(user.organization, **kwargs)
        except Exception as e:
            return get_graphene_error(str(e))

        return {
            "client_user": client_user,
        }


class DeleteClientUser(BaseMutation):
    class Arguments:
        client_user_uuid = graphene.String(required=True)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        try:
            delete_client_user(user.organization, **kwargs)
        except Exception as e:
            return get_graphene_error(str(e))

        return {}


class UpdateOrganizationService(BaseMutation):
    class Arguments:
        standard_invoice_item_input = graphene.NonNull(StandardInvoiceItemInput)

    service = graphene.Field(StandardInvoiceItemType)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        try:
            standard_invoice_item = update_standard_invoice_item(
                user.organization, **kwargs
            )
        except Exception as e:
            return get_graphene_error(str(e))

        return {
            "service": standard_invoice_item,
        }


class DeleteOrganizationService(BaseMutation):
    class Arguments:
        uuid = graphene.String(required=True)

    @logged_in_user_required
    def mutate(self, user: User, **kwargs):
        try:
            delete_standard_invoice_item(user.organization, **kwargs)
        except Exception as e:
            return get_graphene_error(str(e))

        return {}
