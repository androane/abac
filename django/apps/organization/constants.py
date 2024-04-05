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


class SoftwareEnum(BaseEnum):
    FGO = enum.auto()
    NEOMANAGER = enum.auto()
    NEXTUP = enum.auto()
    NEXUS = enum.auto()
    OBLIO = enum.auto()
    ONE_C = enum.auto()
    ONE_C_ALIN = enum.auto()
    REGES = enum.auto()
    SAGA = enum.auto()
    SENIOR_ERP = enum.auto()
    SENIOR_ERP_CLIENT = enum.auto()
    SICO_FINANCIAR = enum.auto()
    SICO_GESTIUNI = enum.auto()
    SMARTBILL = enum.auto()
    TEAMAPP = enum.auto()
    WIND = enum.auto()
