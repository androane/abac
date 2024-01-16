# -*- coding: utf-8 -*-
import factory
from django.conf import settings
from factory.django import DjangoModelFactory


class UserF(DjangoModelFactory):
    class Meta:
        model = settings.AUTH_USER_MODEL

    email = factory.Sequence(lambda n: f"username{n}@test.com")
    first_name = factory.Sequence(lambda n: f"first{n}")
    last_name = factory.Sequence(lambda n: f"last{n}")
    password = factory.PostGenerationMethodCall("set_password", "the password")
    is_active = True
