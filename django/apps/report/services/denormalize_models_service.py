# -*- coding: utf-8 -*-
from typing import Iterable

import pandas as pd

from core.constants import BaseEnum
from organization.models.client import ClientActivity, ClientSolution


class REPORT_COLUMNS(BaseEnum):
    CLIENT = "client"
    PROGRAM_MANAGER = "program_manager"
    ACTIVITY_NAME = "activity_name"
    CATEGORY_CODE = "category_code"
    CATEGORY_NAME = "category_name"
    QUANTITY = "quantity"
    UNIT_COST = "unit_cost"
    UNIT_COST_CURRENCY = "unit_cost_currency"
    DAY = "day"
    MINUTES_ALLOCATED = "minutes_allocated alocate"


def get_flattened_report_data(
    org, year, month, client_uuids=None, category_codes=None, program_manager_uuids=None
):
    qs1: Iterable[ClientSolution] = (
        ClientSolution.objects.filter(
            year=year,
            month=month,
            client__organization=org,
        )
        .select_related("client", "solution")
        .prefetch_related("logs")
    )
    qs2: Iterable[ClientActivity] = (
        ClientActivity.objects.filter(
            year=year,
            month=month,
            client__organization=org,
            is_executed=True,
            activity__solutions__isnull=True,
        )
        .select_related("client", "activity")
        .prefetch_related("logs")
    )

    if client_uuids:
        qs1 = qs1.filter(client__uuid__in=client_uuids)
        qs2 = qs2.filter(client__uuid__in=client_uuids)

    if category_codes:
        qs1 = qs1.filter(solution__category__code__in=category_codes)
        qs2 = qs2.filter(activity__category__code__in=category_codes)

    if program_manager_uuids:
        qs1 = qs1.filter(client__program_manager__uuid__in=program_manager_uuids)
        qs2 = qs2.filter(client__program_manager__uuid__in=program_manager_uuids)

    data = []

    for obj in qs1:
        row = [
            obj.client.name,
            obj.client.program_manager.name,
            obj.solution.name,
            obj.solution.category.code,
            obj.solution.category.name,
            obj.quantity,
            obj.unit_cost,
            obj.unit_cost_currency,
        ]
        if obj.logs.all():
            for log in obj.logs.all():
                data.append(
                    [
                        *row,
                        log.date.day,
                        log.minutes_allocated,
                    ]
                )
        else:
            data.append(
                [
                    *row,
                    None,
                    None,
                ]
            )

    for obj in qs2:
        row = [
            obj.client.name,
            obj.client.program_manager.name,
            obj.activity.name,
            obj.activity.category.code,
            obj.activity.category.name,
            obj.quantity,
            obj.activity.unit_cost,
            obj.activity.unit_cost_currency,
        ]
        if obj.logs.all():
            for log in obj.logs.all():
                data.append(
                    [
                        *row,
                        log.date.day,
                        log.minutes_allocated,
                    ]
                )
        else:
            data.append(
                [
                    *row,
                    None,
                    None,
                ]
            )

    return pd.DataFrame(
        data,
        columns=[
            REPORT_COLUMNS.CLIENT.value,
            REPORT_COLUMNS.PROGRAM_MANAGER.value,
            REPORT_COLUMNS.ACTIVITY_NAME.value,
            REPORT_COLUMNS.CATEGORY_CODE.value,
            REPORT_COLUMNS.CATEGORY_NAME.value,
            REPORT_COLUMNS.QUANTITY.value,
            REPORT_COLUMNS.UNIT_COST.value,
            REPORT_COLUMNS.UNIT_COST_CURRENCY.value,
            REPORT_COLUMNS.DAY.value,
            REPORT_COLUMNS.MINUTES_ALLOCATED.value,
        ],
    )
