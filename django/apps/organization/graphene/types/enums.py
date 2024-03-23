# -*- coding: utf-8 -*-
import graphene

from organization.constants import (
    ClientUserRoleEnum,
    CurrencyEnum,
    InvoiceStatusEnum,
    SoftwareEnum,
    UnitCostTypeEnum,
)
from user.permissions import UserPermissionsEnum

CurrencyEnumType = graphene.Enum.from_enum(CurrencyEnum)
UnitCostTypeEnumType = graphene.Enum.from_enum(UnitCostTypeEnum)
InvoiceStatusEnumType = graphene.Enum.from_enum(InvoiceStatusEnum)
ClientUserRoleEnumType = graphene.Enum.from_enum(ClientUserRoleEnum)
UserPermissionsEnumType = graphene.Enum.from_enum(UserPermissionsEnum)
SoftwareEnumType = graphene.Enum.from_enum(SoftwareEnum)
