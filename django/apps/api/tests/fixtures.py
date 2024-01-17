# -*- coding: utf-8 -*-
import pytest
from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory
from graphene.test import Client
from graphene_django.utils.testing import graphql_query

from api.graphene.schema import schema
from user.tests.factories import UserF


@pytest.fixture(scope="class")
def graphql_client():
    return Client(schema)


@pytest.fixture
def graphql_request(rf: RequestFactory):
    # rf is an instance of django.test.RequestFactory
    # https://pytest-django.readthedocs.io/en/latest/helpers.html#rf-requestfactory
    return rf.get("/graphql/")


@pytest.fixture()
def graphql_request_factory(graphql_request):
    # Q: where is 'rf' coming from?
    # A: pytest-django. it's an instance of django.test.RequestFactory
    # https://pytest-django.readthedocs.io/en/latest/helpers.html#rf-requestfactory
    def _build_request(user):
        graphql_request.user = user
        return graphql_request

    return _build_request


@pytest.fixture()
def graphql_user_request_factory(graphql_request_factory):
    return lambda: graphql_request_factory(UserF())


@pytest.fixture()
def graphql_anonymous_user_request_factory(graphql_request_factory):
    return lambda: graphql_request_factory(AnonymousUser())


@pytest.fixture
def client_query(client):
    def func(*args, **kwargs):
        return graphql_query(*args, **kwargs, client=client)

    return func
