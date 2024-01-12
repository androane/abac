# -*- coding: utf-8 -*-
class IntrospectionDisabledException(Exception):
    pass


class DisableIntrospectionMiddleware(object):
    """
    This middleware should use for production mode. It hides the introspection.
    """

    def resolve(self, next, root, info, **kwargs):
        if info.field_name.lower() in ["__schema", "__introspection"]:
            raise IntrospectionDisabledException
        return next(root, info, **kwargs)
