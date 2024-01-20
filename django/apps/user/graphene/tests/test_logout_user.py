# -*- coding: utf-8 -*-
import pytest
from django.contrib.auth import authenticate as django_auth

from user.tests.factories import UserF

logout_user_mutation = f"""
mutation LogoutUser {{
  logout {{
    error {{
      field
      error
    }}
  }}
}}
"""


@pytest.mark.django_db
def test_logout_user(graphql_client, graphql_request_factory):
    email = "email@test.com"
    password = "good_password"
    user = UserF(email=email)
    user.set_password(password)
    user.save()
    user = django_auth(email=email, password=password)

    request = graphql_request_factory(user)
    assert request.user.is_authenticated

    response = graphql_client.execute(
        logout_user_mutation,
        context=request,
    )

    assert not request.user.is_authenticated
    assert response["data"]["logout"] == {"error": None}
