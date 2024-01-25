# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation, get_graphene_error
from organization.graphene.types import ClientType, InvoiceItemInput, InvoiceItemType
from organization.services.client_service import (
    update_client_invoice_item,
    update_or_create_client,
)
from user.decorators import logged_in_user_required


class UpdateClient(BaseMutation):
    """
    Update or Create a New Client
    """

    class Arguments:
        uuid = graphene.String()
        name = graphene.String(required=True)
        description = graphene.String()
        phone_number_1 = graphene.String()
        phone_number_2 = graphene.String()
        program_manager_uuid = graphene.String()

    client = graphene.Field(ClientType)

    @logged_in_user_required
    def mutate(self, user, **kwargs):
        try:
            client = update_or_create_client(user, **kwargs)
        except Exception as e:
            return get_graphene_error(str(e))

        return {
            "client": client,
        }


class UpdateClientInvoiceItem(BaseMutation):
    class Arguments:
        client_uuid = graphene.String(required=True)
        invoice_uuid = graphene.String(required=True)
        invoice_item_input = graphene.NonNull(InvoiceItemInput)

    invoice_item = graphene.Field(InvoiceItemType)

    @logged_in_user_required
    def mutate(self, user, **kwargs):
        try:
            invoice_item = update_client_invoice_item(user, **kwargs)
        except Exception as e:
            return get_graphene_error(str(e))

        return {
            "invoice_item": invoice_item,
        }
