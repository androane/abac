# -*- coding: utf-8 -*-
import enum

from core.constants import BaseEnum


class ReportTypeEnum(BaseEnum):
    SOLUTIONS_AND_ACTIVITIES_WITHOUT_LOGS = enum.auto()
    SOLUTIONS_AND_ACTIVITIES_INCLUDING_LOGS = enum.auto()
    SUM_LOGGED_TIMES = enum.auto()
