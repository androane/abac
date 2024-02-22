# -*- coding: utf-8 -*-
from typing import Optional

from django.contrib.auth import authenticate as django_auth
from django.http import HttpRequest
from django.utils.timezone import now as django_now

from api import errors
from api.services.auth_service import generate_token_from_user
from user.models import User


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

    request.user = user
    return request, token, error_message


def logout_user(request: HttpRequest) -> HttpRequest:
    request.user = None
    return request


def change_user_password(
    user: User, current_password: str, new_password: str
) -> tuple[Optional[str], Optional[str]]:
    user = django_auth(email=user.email, password=current_password)
    error_message = None
    token = None

    if not user:
        error_message = errors.USER_WRONG_PASSWORD
    else:
        user.set_password(new_password)
        user.save()
        token = generate_token_from_user(user)

    return token, error_message
