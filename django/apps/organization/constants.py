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
