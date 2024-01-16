# -*- coding: utf-8 -*-
import pytest
from django.conf import settings

from user.models import User
from user.tests.factories import UserF


@pytest.mark.django_db
def test_user_model(django_user_model):
    user: User = UserF()
    print(user.id)
    assert (
        user.admin_absolute_url
        == f"{settings.DJANGO_HOST}/admin/user/user/{user.id}/change/"
    )

    user.delete()
    user = django_user_model.all_objects.get(id=user.id)
    assert user.is_deleted

    user.hard_delete()

    assert not django_user_model.all_objects.filter(id=user.id).exists()
