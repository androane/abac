# -*- coding: utf-8 -*-
from django.contrib.auth import get_user_model


def get_program_managers():
    return get_user_model().objects.filter(is_staff=False)
