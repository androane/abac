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

    client_profile = graphene.NonNull(
        "organization.graphene.types.ClientUserProfileType"
    )

    # properties
    name = graphene.String(required=True)
