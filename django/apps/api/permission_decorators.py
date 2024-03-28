# -*- coding: utf-8 -*-
import functools

from core.exceptions import PermissionException
from core.graphql_errors import GraphQLErrorForbidden
from user.permissions import validate_has_permission


def permission_required(permission):
    def inner(func):
        @functools.wraps(func)
        def decorator(self, info, *args, **kwargs):
            from user.models import User

            if type(info) is User:
                user = info
            else:
                user = info.context.user
            try:
                validate_has_permission(user, permission)
            except PermissionException as e:
                raise GraphQLErrorForbidden(str(e))

            return func(self, info, *args, **kwargs)

        return decorator

    return inner


def field_permission_required(permission):
    def inner(func):
        @functools.wraps(func)
        def decorator(self, info, *args, **kwargs):
            user = info.context.user
            try:
                validate_has_permission(user, permission)
            except PermissionException:
                return None
            return func(self, info, *args, **kwargs)

        return decorator

    return inner
