# -*- coding: utf-8 -*-
import functools


def logged_in_user_required(func):
    @functools.wraps(func)
    def decorator(self, info, *args, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("You must be authenticated to perform this operation.")
        return func(self, user, *args, **kwargs)

    return decorator
