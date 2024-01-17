# -*- coding: utf-8 -*-
import graphene


class ErrorType(graphene.ObjectType):
    field = graphene.String()
    error = graphene.String(required=True)


class BaseMutation(graphene.Mutation):
    class Meta:
        abstract = True

    errors = graphene.List(ErrorType)
