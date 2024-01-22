# -*- coding: utf-8 -*-
import graphene

from organization.graphene import schema as organization_schema
from user.graphene import schema as user_schema


class Query(
    organization_schema.Query,
    user_schema.Query,
    graphene.ObjectType,
):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    # debug = graphene.Field(DjangoDebug, name='__debug')
    pass


class Mutation(
    organization_schema.Mutation,
    user_schema.Mutation,
    graphene.ObjectType,
):
    # This class will inherit from multiple Mutations
    # as we begin to add more apps to our project
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
