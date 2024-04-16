# -*- coding: utf-8 -*-
import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType

from organization.services.user.user_category_permissions import get_user_categories
from organization.services.user.user_client_permissions import get_user_clients
from user.constants import UserRoleEnum
from user.permissions import UserPermissionsEnum

UserModel = get_user_model()

UserPermissionsEnumType = graphene.Enum.from_enum(UserPermissionsEnum)
UserRoleEnumType = graphene.Enum.from_enum(UserRoleEnum)


class UserType(DjangoObjectType):
    class Meta:
        model = UserModel
        only_fields = (
            "uuid",
            "email",
            "first_name",
            "last_name",
            "client_profile",
            "organization",
        )

    # Property
    name = graphene.String(required=True)

    client_profile = graphene.NonNull(
        "organization.graphene.types.ClientUserProfileType"
    )
    organization = graphene.NonNull("organization.graphene.types.OrganizationType")
    permissions = graphene.List(
        graphene.NonNull(UserPermissionsEnumType), required=True
    )
    clients = graphene.List(
        graphene.NonNull("organization.graphene.types.ClientType"), required=True
    )
    categories = graphene.List(
        graphene.NonNull("organization.graphene.types.CategoryType"), required=True
    )
    role = UserRoleEnumType(required=True)

    def resolve_email(self, info):
        # If the email was generated by the system, pretend it doesn't exist
        if self.email == self.generate_client_user_email():
            return ""

        return self.email

    def resolve_permissions(self, info):
        return self.user_permissions.all().values_list("codename", flat=True)

    def resolve_clients(self, info):
        return get_user_clients(self)

    def resolve_categories(self, info):
        return get_user_categories(self)

    def resolve_client_profile(self, info):
        return info.context.client_profile_from_user.load(self.id)

    def resolve_role(self, info):
        return info.context.role_from_user.load(self.id)

    # START OF UNUSED FIELDS, BUT NEEDED ON THE FRONTEND
    photo_url = graphene.String(required=True)

    def resolve_photo_url(self, info):
        return ""

    # END OF UNUSED FIELDS
