# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation, ErrorType
from organization.graphene.types import InvoiceItemInput
from organization.services.customer_organization_service import (
    update_customer_organization_invoice_item,
    update_or_create_customer_organization,
)
from user.decorators import logged_in_user_required


class UpdateCustomerOrganization(BaseMutation):
    """
    Update or Create a new customer organization
    """

    class Arguments:
        uuid = graphene.String()
        name = graphene.String(required=True)
        phone_number_1 = graphene.String()
        phone_number_2 = graphene.String()
        description = graphene.String()
        program_manager_uuid = graphene.String()

    @logged_in_user_required
    def mutate(self, user, **kwargs):
        try:
            update_or_create_customer_organization(user, **kwargs)
        except Exception as e:
            return {"error": str(e)}


class UpdateCustomerOrganizationInvoiceItem(BaseMutation):
    class Arguments:
        customer_organization_uuid = graphene.String(required=True)
        invoice_uuid = graphene.String(required=True)
        invoice_item_input = graphene.NonNull(InvoiceItemInput)

    error = graphene.Field(ErrorType)

    @logged_in_user_required
    def mutate(self, user, **kwargs):
        try:
            update_customer_organization_invoice_item(user, **kwargs)
        except Exception as e:
            return {"error": str(e)}
