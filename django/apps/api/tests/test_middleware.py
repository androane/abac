# -*- coding: utf-8 -*-
import pytest
from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory

from api.middleware import JWTAuthenticationMiddleware
from api.services.auth_service import (
    AUTH_TOKEN_PREFIX,
    AUTHORIZATION_KEY,
    generate_token_from_user,
)
from user.tests.factories import UserF


@pytest.mark.django_db
def test_jwt_authetication_middlewre_valid_token(mocker):
    mocker.patch("api.middleware.patch_vary_headers")
    request_factory = RequestFactory()
    request = request_factory.get("/graphql/")

    # AnonymousUser login
    request.user = AnonymousUser()
    user = UserF()
    token = generate_token_from_user(user)
    request.META = {
        AUTHORIZATION_KEY: f"{AUTH_TOKEN_PREFIX} {token}",
    }
    middleware_class = JWTAuthenticationMiddleware(mocker.Mock())
    middleware_class(request)

    assert request.user == user


@pytest.mark.django_db
def test_jwt_authetication_middlewre_invalid_token(mocker):
    mocker.patch("api.middleware.patch_vary_headers")
    request_factory = RequestFactory()
    request = request_factory.get("/graphql/")

    # AnonymousUser login
    request.user = AnonymousUser()
    request.META = {
        AUTHORIZATION_KEY: f"{AUTH_TOKEN_PREFIX} INVALID_TOKEN",
    }
    middleware_class = JWTAuthenticationMiddleware(mocker.Mock())
    middleware_class(request)

    assert request.user.is_anonymous
