# -*- coding: utf-8 -*-
from django.contrib.auth import get_user_model
from django.db.models import QuerySet

from organization.graphene.types import ClientUserInput
from organization.models import Client, ClientUserProfile
from user.models import User


def get_client_program_managers() -> QuerySet[User]:
    return get_user_model().objects.filter(is_staff=False, client__isnull=True)


def get_client_users(user: User, client_uuid: str) -> QuerySet[User]:
    client = Client.objects.get(
        uuid=client_uuid,
        organization=user.organization,
    )
    return client.users.filter(client_profile__isnull=False)


def update_client_user(
    user: User, client_uuid: str, client_user_input: ClientUserInput
) -> User:
    client = Client.objects.get(
        uuid=client_uuid,
        organization=user.organization,
    )
    if client_user_input.uuid:
        client_user: User = client.users.get(
            organization=user.organization, uuid=client_user_input.uuid
        )
        client_user_profile = client_user.client_profile
    else:
        client_user: User = get_user_model()(
            organization=user.organization, client=client
        )
        client_user_profile = ClientUserProfile(client=client)

    client_user.email = client_user_input.email
    client_user.first_name = client_user_input.first_name
    client_user.last_name = client_user_input.last_name
    client_user.save()

    client_user_profile.ownership_percentage = client_user_input.ownership_percentage
    client_user_profile.role = client_user_input.role
    client_user_profile.spv_username = client_user_input.spv_username
    client_user_profile.spv_password = client_user_input.spv_password
    client_user_profile.user = client_user
    client_user_profile.save()

    return client_user
