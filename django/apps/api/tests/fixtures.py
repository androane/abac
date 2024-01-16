# -*- coding: utf-8 -*-
import pytest
from django.test import RequestFactory
from graphene.test import Client

from api.graphene.schema import schema


@pytest.fixture(scope="class")
def graphql_client():
    return Client(schema)


@pytest.fixture()
def make_graphql_request(rf: RequestFactory):
    # Q: where is 'rf' coming from?
    # A: pytest-django. it's an instance of django.test.RequestFactory
    # https://pytest-django.readthedocs.io/en/latest/helpers.html#rf-requestfactory
    def _build_request(user):
        request = rf.get("/graphql/")
        request.user = user
        return request

    return _build_request


@pytest.fixture()
def make_user_ctx(user_f, make_graphql_request):
    return lambda: make_graphql_request(user_f())
