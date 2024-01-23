# -*- coding: utf-8 -*-
import graphene

from organization.graphene.mutations import (
    UpdateCustomerOrganization,
    UpdateCustomerOrganizationInvoiceItem,
)
from organization.graphene.types import CustomerOrganizationType
from user.decorators import logged_in_user_required


class Query(graphene.ObjectType):
    class Meta:
        abstract = True

    customer_organizations = graphene.List(
        graphene.NonNull(CustomerOrganizationType),
        required=True,
        description="List all Customer Organization",
    )
    customer_organization = graphene.Field(
        graphene.NonNull(CustomerOrganizationType),
        description="Get an individual Customer Organization",
        uuid=graphene.String(required=True),
    )

    @logged_in_user_required
    def resolve_customer_organizations(info, user, **kwargs):
        return user.organization.customer_organizations.all()

    @logged_in_user_required
    def resolve_customer_organization(info, user, **kwargs):
        return user.organization.customer_organizations.get(uuid=kwargs["uuid"])


class Mutation(graphene.ObjectType):
    update_customer_organization = UpdateCustomerOrganization.Field(
        description="Create a new customer organization"
    )
    update_customer_organization_invoice_item = (
        UpdateCustomerOrganizationInvoiceItem.Field(
            description="Create a new customer organization invoice items"
        )
    )
