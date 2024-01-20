# -*- coding: utf-8 -*-
import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType

UserModel = get_user_model()


class UserType(DjangoObjectType):
    name = graphene.String(required=True)

    class Meta:
        model = UserModel
        only_fields = ("uuid", "email")
