# -*- coding: utf-8 -*-
from django.db.models import QuerySet

from organization.models import CustomerOrganizationDocument
from user.models import User


def get_client_files(
    user: User,
    client_uuid: str,
) -> QuerySet[CustomerOrganizationDocument]:
    client_documents = CustomerOrganizationDocument.objects.filter(
        customer_organization__uuid=client_uuid,
        customer_organization__organization=user.organization,
    )
    return client_documents
