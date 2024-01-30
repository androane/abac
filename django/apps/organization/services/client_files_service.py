# -*- coding: utf-8 -*-
from django.db.models import QuerySet
from graphene_file_upload.scalars import Upload

from organization.models import Client, ClientFile
from user.models import User


def get_client_files(
    user: User,
    client_uuid: str,
) -> QuerySet[ClientFile]:
    return ClientFile.objects.filter(
        client__uuid=client_uuid,
        client__organization=user.organization,
    )


def create_client_files(
    user: User,
    client_uuid: str,
    client_files_input: list[Upload],
) -> Client:
    client = Client.objects.get(
        uuid=client_uuid,
        organization=user.organization,
    )
    ClientFile.objects.bulk_create(
        [
            ClientFile(
                client=client,
                file=client_file_input.file,
            )
            for client_file_input in client_files_input
        ]
    )
    return client
