# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation
from organization.graphene.types import CurrencyEnumType
from organization.services.customer_organization_service import (
    create_customer_organization,
)
from user.decorators import logged_in_user_required


class CreateCustomerOrganization(BaseMutation):
    """
    Create a new customer organization
    """

    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        monthly_invoice_ammount = graphene.Int()
        monthly_invoice_currency = graphene.Argument(CurrencyEnumType)
        program_manager_uuid = graphene.String()

    @logged_in_user_required
    def mutate(self, user, **kwargs):
        try:
            create_customer_organization(user, **kwargs)
        except Exception as e:
            return {"error": str(e)}
