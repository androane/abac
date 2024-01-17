# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation
from user.graphene.types import UserType
from user.services.user_auth_service import login_user, logout_user


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
            "errors": [{"error": error}] if error else None,
        }


class LogoutUser(BaseMutation):
    """
    Logs out the user
    """

    def mutate(self, info, **kwargs):
        request = info.context
        user = request.user
        if not user.is_authenticated:
            raise Exception("You must be authenticated to perform this operation.")
        logout_user(request)
        return {}
