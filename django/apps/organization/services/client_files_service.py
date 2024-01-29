# -*- coding: utf-8 -*-
from django.db.models import QuerySet
from graphene_file_upload.scalars import Upload

from organization.models import CustomerOrganization, CustomerOrganizationDocument
from user.models import User


def get_client_files(
    user: User,
    client_uuid: str,
) -> QuerySet[CustomerOrganizationDocument]:
    return CustomerOrganizationDocument.objects.filter(
        customer_organization__uuid=client_uuid,
        customer_organization__organization=user.organization,
    )


def create_client_files(
    user: User,
    client_uuid: str,
    client_files_input: list[Upload],
) -> CustomerOrganization:
    client = CustomerOrganization.objects.get(
        uuid=client_uuid,
        organization=user.organization,
    )
    CustomerOrganizationDocument.objects.bulk_create(
        [
            CustomerOrganizationDocument(
                customer_organization=client,
                document=client_file_input.file,
            )
            for client_file_input in client_files_input
        ]
    )
    return client
