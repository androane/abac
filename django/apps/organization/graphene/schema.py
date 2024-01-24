# -*- coding: utf-8 -*-
import graphene

from organization.graphene.mutations import (
    UpdateCustomerOrganization,
    UpdateCustomerOrganizationInvoiceItem,
)
from organization.graphene.types import CustomerOrganizationType, InvoiceType
from organization.services.invoice_service import get_customer_organization_invoice
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
    customer_organization_invoice = graphene.Field(
        graphene.NonNull(InvoiceType),
        customer_organization_uuid=graphene.String(required=True),
        month=graphene.Int(),
        year=graphene.Int(),
    )

    @logged_in_user_required
    def resolve_customer_organizations(info, user, **kwargs):
        return user.organization.customer_organizations.all()

    @logged_in_user_required
    def resolve_customer_organization(info, user, **kwargs):
        return user.organization.customer_organizations.get(uuid=kwargs["uuid"])

    @logged_in_user_required
    def resolve_customer_organization_invoice(info, user, **kwargs):
        return get_customer_organization_invoice(user, **kwargs)


class Mutation(graphene.ObjectType):
    update_customer_organization = UpdateCustomerOrganization.Field(
        description="Update or Create a New Customer Organization"
    )
    update_customer_organization_invoice_item = (
        UpdateCustomerOrganizationInvoiceItem.Field(
            description="Update or Create a New Customer Organization Invoice Item"
        )
    )
