# -*- coding: utf-8 -*-
from typing import TYPE_CHECKING

from django.contrib.auth import get_user_model

from core.exceptions import PermissionException
from organization.constants import ClientUserRoleEnum
from organization.models import Client, ClientUserProfile, Organization
from user.models import User
from user.permissions import UserPermissionsEnum, validate_has_permission

if TYPE_CHECKING:
    from organization.graphene.types import ClientUserInput


def get_client_users(user: User, client: Client) -> list[User]:
    try:
        validate_has_permission(user, UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS)
    except PermissionException:
        return client.users.exclude(
            client_profile__role=ClientUserRoleEnum.ASSOCIATE.value
        )

    return client.users.all()


def update_client_user(
    org: Organization, client_uuid: str, client_user_input: "ClientUserInput"
) -> User:
    client = Client.objects.get(
        uuid=client_uuid,
        organization=org,
    )
    if client_user_input.uuid:
        client_user: User = client.users.get(
            organization=org, uuid=client_user_input.uuid
        )
        client_user_profile = client_user.client_profile
    else:
        client_user: User = get_user_model()(organization=org, client=client)
        client_user_profile = ClientUserProfile(client=client)

    for field in ("first_name", "last_name"):
        setattr(client_user, field, client_user_input.get(field))

    client_user.save()

    client_user.email = (
        client_user_input.get("email") or client_user.generate_client_user_email()
    )
    client_user.save()

    for field in (
        "ownership_percentage",
        "role",
        "spv_username",
        "spv_password",
        "phone_number",
    ):
        value = client_user_input.get(field)
        if value:
            setattr(client_user_profile, field, value)

    client_user_profile.user = client_user
    client_user_profile.save()

    return client_user


def delete_client_user(org: Organization, user_uuid: str) -> None:
    org.users.get(uuid=user_uuid, client__isnull=False).delete()
