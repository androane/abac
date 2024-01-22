# -*- coding: utf-8 -*-
import importlib

# from django.db import connection
from pytest_factoryboy import register

from api.tests.fixtures import *
from core.tests.fixtures import *
from user.tests.fixtures import *


def collect_factories():
    factories = [
        "api.tests.factories",
        "core.tests.factories",
        "organization.tests.factories",
        "user.tests.factories",
    ]

    for factory_module in factories:
        classes = importlib.import_module(factory_module, "apps")
        for attr in dir(classes):
            if attr.endswith("F"):
                FactoryClass = getattr(classes, attr)
                # UserF factory can be used as a fiture like user_f
                register(FactoryClass)


collect_factories()


# with connection.cursor() as cursor:
#     cursor.execute("CREATE COLLATION IF NOT EXISTS case_insensitive (provider = icu, locale = 'und-u-ks-level2', deterministic=false);")
