# -*- coding: utf-8 -*-
from django.db.models import QuerySet

from organization.graphene.types import ClientFileInput
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
    client_files_input: list[ClientFileInput],
) -> None:
    client = CustomerOrganization.objects.get(
        uuid=client_uuid,
        organization=user.organization,
    )
    CustomerOrganizationDocument.objects.bulk_create(
        [
            CustomerOrganizationDocument(
                customer_organization=client,
                name=client_file_input.name,
                description=client_file_input.description,
                document=client_file_input.file,
            )
            for client_file_input in client_files_input
        ]
    )
    return client
