# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation
from user.decorators import logged_in_user_required
from user.graphene.types import UserType
from user.services.user_auth_service import change_user_password, login_user


class LoginUser(BaseMutation):
    """
    Authentication mutation. Post the email and password, and get a token
    you can use for subsequent requests.
    """

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()
    user = graphene.Field(UserType)

    def mutate(self, info, email, password, **kwargs):
        request, token, error = login_user(info.context, email, password)
        return {
            "token": token,
            "user": request.user,
            "error": {"message": error} if error else None,
        }


class LogoutUser(BaseMutation):
    @logged_in_user_required
    def mutate(self, user, **kwargs):
        return {}


class ChangePassword(BaseMutation):
    class Arguments:
        current_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    token = graphene.String()

    @logged_in_user_required
    def mutate(self, user, **kwargs):
        token, error = change_user_password(user, **kwargs)
        return {
            "token": token,
            "error": {"message": error} if error else None,
        }
