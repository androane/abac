# -*- coding: utf-8 -*-
import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType

UserModel = get_user_model()


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

    # START OF UNUSED FIELDS, BUT NEEDED ON THE FRONTEND
    photo_url = graphene.String(required=True)
    role = graphene.String(required=True)

    def resolve_photo_url(self, info):
        return ""

    def resolve_role(self, info):
        return ""

    # ENDOF UNUSED FIELDS
    client_profile = graphene.NonNull(
        "organization.graphene.types.ClientUserProfileType"
    )
    organization = graphene.NonNull("organization.graphene.types.OrganizationType")

    # properties
    name = graphene.String(required=True)
