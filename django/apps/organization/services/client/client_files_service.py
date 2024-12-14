# -*- coding: utf-8 -*-

from organization.graphene.types.client_types import ClientFileInput
from organization.models import Client, ClientFile, Organization


def create_client_files(
    org: Organization,
    client_uuid: str,
    client_files_input: list[ClientFileInput],
) -> Client:
    client = Client.objects.get(
        uuid=client_uuid,
        organization=org,
    )
    ClientFile.objects.bulk_create(
        [
            ClientFile(
                client=client,
                file=client_file_input.file,
                type=client_file_input.type,
            )
            for client_file_input in client_files_input
        ]
    )
    return client


def delete_client_file(
    org: Organization,
    file_uuid: str,
) -> None:
    ClientFile.objects.get(uuid=file_uuid, client__organization=org).delete()
