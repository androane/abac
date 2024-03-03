# -*- coding: utf-8 -*-
from organization.graphene.types import ClientActivityInput
from organization.models import ClientActivity, Invoice, Organization


def update_client_activity(
    org: Organization,
    client_uuid: str,
    client_activity_input: ClientActivityInput,
) -> Invoice:
    client_activity = ClientActivity.objects.get(
        client__uuid=client_uuid, client__organization=org
    )
    print(client_activity_input)
    print(client_activity)
    pass


def delete_client_activity(org: Organization, activity_uuid: str) -> None:
    ClientActivity.objects.get(uuid=activity_uuid, client__organization=org).delete()
