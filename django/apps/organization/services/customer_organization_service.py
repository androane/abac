# -*- coding: utf-8 -*-
from typing import Optional

from organization.constants import CurrencyEnum
from organization.models import CustomerOrganization
from user.models import User


def create_customer_organization(
    user: User,
    name: str,
    description: Optional[str],
    monthly_invoice_ammount: Optional[int],
    monthly_invoice_currency: Optional[CurrencyEnum],
    program_manager_uuid: Optional[str],
) -> None:
    program_manager = User.objects.get(uuid=program_manager_uuid)
    CustomerOrganization.objects.create(
        name=name,
        description=description,
        monthly_invoice_ammount=monthly_invoice_ammount,
        monthly_invoice_currency=monthly_invoice_currency,
        program_manager=program_manager,
        organization=user.organization,
    )
