# -*- coding: utf-8 -*-
import graphene

from api.errors import APIException
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
        try:
            request, token = login_user(info.context, email, password)
        except APIException as error:
            return {"error": {"message": str(error)}}

        return {
            "token": token,
            "user": request.user,
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
        try:
            token = change_user_password(user, **kwargs)
        except APIException as error:
            return {"error": {"message": str(error)}}

        return {
            "token": token,
        }
