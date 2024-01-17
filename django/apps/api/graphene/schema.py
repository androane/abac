# -*- coding: utf-8 -*-
import graphene

from user.graphene import schema as user_schema


class Query(
    user_schema.Query,
    graphene.ObjectType,
):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    # debug = graphene.Field(DjangoDebug, name='__debug')
    pass


class Mutation(
    user_schema.Mutation,
    graphene.ObjectType,
):
    # This class will inherit from multiple Mutations
    # as we begin to add more apps to our project
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
