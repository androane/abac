# -*- coding: utf-8 -*-
import graphene
from django.contrib.auth import get_user_model

from user.decorators import logged_in_user_required
from user.graphene.mutations import ChangePassword, LoginUser, LogoutUser
from user.graphene.types import UserType


class Query(graphene.ObjectType):
    class Meta:
        abstract = True

    current_user = graphene.Field(UserType, required=True)
    users = graphene.List(
        graphene.NonNull(UserType),
        required=True,
        description="List all users",
    )

    @logged_in_user_required
    def resolve_current_user(info, user):
        return user

    def resolve_users(info, context):
        return get_user_model().objects.all()


class Mutation(graphene.ObjectType):
    login = LoginUser.Field(description="Log the user in with email and password.")
    logout = LogoutUser.Field(description="Log out user.")
    change_password = ChangePassword.Field(description="Change password for a user")
