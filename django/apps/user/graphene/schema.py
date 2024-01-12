# -*- coding: utf-8 -*-
import graphene
from django.contrib.auth import get_user_model

from user.graphene.types import UserType


class Query(graphene.ObjectType):
    class Meta:
        abstract = True

    users = graphene.List(
        UserType,
        description="List all users",
    )

    def resolve_users(info, context):
        return get_user_model().objects.all()


class Mutation(graphene.ObjectType):
    pass
