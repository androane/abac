# -*- coding: utf-8 -*-
import graphene


class ErrorType(graphene.ObjectType):
    field = graphene.String()
    message = graphene.String(required=True)


class BaseMutation(graphene.Mutation):
    class Meta:
        abstract = True

    error = graphene.Field(ErrorType)
