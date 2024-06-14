# -*- coding: utf-8 -*-
import graphene

from report.constants import ReportTypeEnum

ReportTypeEnumType = graphene.Enum.from_enum(ReportTypeEnum)
