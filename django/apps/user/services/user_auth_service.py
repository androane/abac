# -*- coding: utf-8 -*-
from typing import Optional

from django.contrib.auth import authenticate as django_auth
from django.contrib.auth.models import AnonymousUser
from django.http import HttpRequest
from django.utils.timezone import now as django_now

from api import errors
from api.services.auth_service import generate_token_from_user


def login_user(
    request: HttpRequest, email: str, password: str
) -> tuple[HttpRequest, Optional[str], Optional[str]]:
    user = django_auth(email=email, password=password)
    error_message = None
    token = None

    if not user:
        error_message = errors.USER_WRONG_EMAIL_OR_PASSWORD
    else:
        user.last_login = django_now()
        user.save()
        token = generate_token_from_user(user)

    request.user = user or AnonymousUser()
    return request, token, error_message


def logout_user(request: HttpRequest) -> HttpRequest:
    request.user = AnonymousUser()
    return request
