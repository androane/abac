# -*- coding: utf-8 -*-
import graphene
from graphene_django import DjangoObjectType

from organization.constants import CurrencyEnum
from organization.models import CustomerOrganization

CurrencyEnumType = graphene.Enum.from_enum(CurrencyEnum)


class CustomerOrganizationType(DjangoObjectType):
    class Meta:
        model = CustomerOrganization
        only_fields = (
            "uuid",
            "name",
            "description",
            "monthly_invoice_ammount",
            "monthly_invoice_currency",
            "program_manager",
        )
