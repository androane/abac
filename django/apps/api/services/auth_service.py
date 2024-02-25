# -*- coding: utf-8 -*-
import time
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional

import jwt
from django.conf import settings

if TYPE_CHECKING:
    from user.models import User

ALGORITHM = "HS256"
AUTH_TOKEN_PREFIX = "Bearer"
AUTHORIZATION_KEY = "HTTP_AUTHORIZATION"


@dataclass
class AuthPayload:
    iat: int
    user_id: int
    is_impersonator: bool
    authenticated: Optional[bool] = None


@dataclass
class Authorization:
    token: str
    claims: dict
    is_authenticated: bool


def get_auth_payload_from_user(user: "User") -> dict:
    return AuthPayload(
        iat=int(time.time()),  # UTC now
        user_id=user.id,
        is_impersonator=user.is_staff,
    )


def generate_token_from_user(user: "User") -> Optional[str]:
    if not user.is_active:
        return None

    auth_payload = get_auth_payload_from_user(user)
    auth_payload.authenticated = True

    token = jwt.encode(
        auth_payload.__dict__, settings.GRAPHQL_AUTH_SECRET, algorithm=ALGORITHM
    )
    if type(token) is bytes:
        token = token.decode("utf-8")
    return token


def get_token_from_request(request) -> Optional[str]:
    authorization_key = (request.META.get(AUTHORIZATION_KEY) or "").split()

    if len(authorization_key) != 2:
        return None

    prefix, token = authorization_key

    if prefix.lower() != AUTH_TOKEN_PREFIX.lower():
        return None

    return token


def get_authorization_from_jwt_token(token: Optional[str]) -> Authorization:
    """
    The token must not have a prefix, it should be just the JWT string.
    """
    is_authenticated = False
    claims = None
    if token:
        try:
            if token.startswith("b'") and token[-1] == "'":
                token = token[2:-1]
            claims = jwt.decode(
                token, settings.GRAPHQL_AUTH_SECRET, algorithms=[ALGORITHM]
            )
            if claims.get("user_id"):
                is_authenticated = True
        except jwt.DecodeError:
            pass
    return Authorization(token=token, claims=claims, is_authenticated=is_authenticated)
