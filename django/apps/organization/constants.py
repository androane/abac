# -*- coding: utf-8 -*-
import enum

from core.constants import BaseEnum


class CurrencyEnum(BaseEnum):
    RON = enum.auto()
    EUR = enum.auto()
    USD = enum.auto()


class InvoiceStatusEnum(BaseEnum):
    DRAFT = enum.auto()
    SENT = enum.auto()


class ClientUserRoleEnum(BaseEnum):
    ADMINSTRATOR = enum.auto()
    ASSOCIATE = enum.auto()
    EMPLOYEE = enum.auto()
    MANAGER = enum.auto()


class UnitCostTypeEnum(BaseEnum):
    FIXED = enum.auto()
    HOURLY = enum.auto()
