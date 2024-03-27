# -*- coding: utf-8 -*-
import enum

from core.constants import BaseEnum


class UserRoleEnum(BaseEnum):
    CLIENT = enum.auto()
    PM = enum.auto()
