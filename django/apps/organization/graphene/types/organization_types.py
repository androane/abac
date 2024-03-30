# -*- coding: utf-8 -*-
import graphene
from graphene_django import DjangoObjectType

from organization.graphene.types.activity_types import ActivityType, SolutionType
from organization.graphene.types.client_types import ClientGroupType, ClientType
from organization.models.organization import Organization, OrganizationBusinessCategory
from organization.services.client_service import get_clients
from organization.services.organization_activity_service import (
    get_organization_activities,
)
from organization.services.organization_categories_service import (
    get_organization_categories,
)
from organization.services.organization_solution_service import get_organization_solutions
from organization.services.organization_user_service import (
    get_organization_users,
    get_organzation_user,
)
from user.graphene.types import UserType


class CategoryType(DjangoObjectType):
    class Meta:
        model = OrganizationBusinessCategory
        only_fields = (
            "uuid",
            "name",
            "code",
        )


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        only_fields = (
            "uuid",
            "name",
            "categories",
        )

    solutions = graphene.List(graphene.NonNull(SolutionType), required=True)
    activities = graphene.List(graphene.NonNull(ActivityType), required=True)
    logo_url = graphene.NonNull(graphene.String)
    clients = graphene.List(graphene.NonNull(ClientType), required=True)
    users = graphene.NonNull(graphene.List(graphene.NonNull(UserType)))
    user = graphene.NonNull(UserType, uuid=graphene.String(required=True))
    client_groups = graphene.List(graphene.NonNull(ClientGroupType), required=True)

    def resolve_clients(self, info, **kwargs):
        return get_clients(info.context.user).order_by("name")

    def resolve_logo_url(self, info):
        if self.logo:
            return self.logo.url

    def resolve_users(self, info, **kwargs):
        return get_organization_users(self, **kwargs)

    def resolve_user(self, info, **kwargs):
        return get_organzation_user(self, **kwargs)

    def resolve_solutions(self, info, **kwargs):
        return get_organization_solutions(info.context.user)

    def resolve_activities(self, info, **kwargs):
        return get_organization_activities(info.context.user)

    def resolve_client_groups(self, info, **kwargs):
        return self.client_groups.all()

    def resolve_categories(self, info, **kwargs):
        return get_organization_categories(info.context.user)
