# -*- coding: utf-8 -*-

from graphql import GraphQLError

from core.constants import BaseEnum


class GraphQLErrorsEnum(BaseEnum):
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS"
    FORBIDDEN = "FORBIDDEN"


class GraphQLErrorUnauthorized(GraphQLError):
    def __init__(self, message="", *args, **kwargs):
        return super().__init__(
            message,
            extensions={"errorCode": GraphQLErrorsEnum.UNAUTHORIZED_ACCESS.value},
            *args,
            **kwargs,
        )


class GraphQLErrorForbidden(GraphQLError):
    def __init__(self, message="", *args, **kwargs):
        return super().__init__(
            message,
            extensions={"errorCode": GraphQLErrorsEnum.FORBIDDEN.value},
            *args,
            **kwargs,
        )
