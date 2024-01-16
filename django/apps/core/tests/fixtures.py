# -*- coding: utf-8 -*-
import pytest

from user.tests.factories import UserF


@pytest.fixture(autouse=True)
def reset_factory_boy_sequences():
    UserF.reset_sequence()
