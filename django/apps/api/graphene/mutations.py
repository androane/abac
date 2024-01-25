# -*- coding: utf-8 -*-
import graphene


class ErrorType(graphene.ObjectType):
    field = graphene.String()
    message = graphene.String(required=True)


def get_graphene_error(message, field=None):
    return {
        "error": {
            "field": field,
            "message": message,
        }
    }


class BaseMutation(graphene.Mutation):
    class Meta:
        abstract = True

    error = graphene.Field(ErrorType)
