# -*- coding: utf-8 -*-
import pytest

from user.tests.factories import UserF

login_user_mutation = f"""
mutation LoginUser(
  $email: String!
  $password: String!
) {{
  login(
    email: $email
    password: $password
  ) {{
    error {{
      field
      message
    }}
    user {{
      email
    }}
  }}
}}
"""


@pytest.fixture
def user_to_login():
    email = "email@test.com"
    password = "good_password"
    user = UserF(email=email)
    user.set_password(password)
    user.save()
    return user


@pytest.mark.django_db
@pytest.mark.parametrize(
    "password, user_found, expected_response",
    [
        [
            "wrong_password",
            False,
            {
                "error": {"field": None, "message": "USER_WRONG_EMAIL_OR_PASSWORD"},
                "user": None,
            },
        ],
        ["good_password", True, {"error": None, "user": {"email": "email@test.com"}}],
    ],
)
def test_login_user(
    user_to_login,
    user_found,
    password,
    expected_response,
    graphql_client,
    graphql_anonymous_user_request_factory,
):
    request = graphql_anonymous_user_request_factory()

    response = graphql_client.execute(
        login_user_mutation,
        variables=dict(
            email=user_to_login.email,
            password=password,
        ),
        context=request,
    )
    assert bool(request.user) is user_found
    assert response["data"]["login"] == expected_response
