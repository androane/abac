# -*- coding: utf-8 -*-
from organization.graphene.types.client_types import ClientGroupInput
from organization.models.client import ClientGroup
from organization.models.organization import Organization


def update_client_group(
    org: Organization, client_group_input: ClientGroupInput
) -> ClientGroup:
    if client_group_input.uuid:
        client_group = org.client_groups.get(uuid=client_group_input.uuid)
    else:
        client_group = ClientGroup(organization=org)

    for attr in ("name",):
        setattr(client_group, attr, getattr(client_group_input, attr))

    client_group.save()

    org.clients.filter(uuid__in=client_group_input.client_uuids).update(
        group_id=client_group.id
    )

    return client_group


def delete_client_group(org: Organization, uuid: str) -> None:
    org.client_groups.get(uuid=uuid).delete()
