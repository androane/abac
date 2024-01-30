# -*- coding: utf-8 -*-
import enum

from core.constants import BaseEnum


class ClientUserRoleEnum(BaseEnum):
    ADMINSTRATOR = enum.auto()
    ASSOCIATE = enum.auto()
    EMPLOYEE = enum.auto()
