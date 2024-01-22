# -*- coding: utf-8 -*-
import graphene

from organization.graphene.mutations import CreateCustomerOrganization
from organization.graphene.types import CustomerOrganizationType
from user.decorators import logged_in_user_required


class Query(graphene.ObjectType):
    class Meta:
        abstract = True

    customer_organizations = graphene.List(
        graphene.NonNull(CustomerOrganizationType),
        required=True,
        description="List all customers",
    )

    @logged_in_user_required
    def resolve_customer_organizations(info, user, **kwargs):
        return user.organization.customer_organizations.all()


class Mutation(graphene.ObjectType):
    create_customer_organization = CreateCustomerOrganization.Field(
        description="Create a new customer organization"
    )
