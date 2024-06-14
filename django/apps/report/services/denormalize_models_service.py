# -*- coding: utf-8 -*-
from typing import Iterable

import pandas as pd

from core.constants import BaseEnum
from organization.models.client import ClientActivity, ClientSolution


class REPORT_COLUMNS(BaseEnum):
    CLIENT = "client"
    PROGRAM_MANAGER = "program_manager"
    ACTIVITY_NAME = "activity_name"
    CATEGORY_NAME = "category_name"
    QUANTITY = "quantity"
    UNIT_COST = "unit_cost"
    UNIT_COST_CURRENCY = "unit_cost_currency"
    LOG_DAY = "log_day"
    LOG_MINUTES_ALLOCATED = "log_minutes_allocated alocate"


def get_flattened_report_data(
    org,
    year,
    month,
    client_uuids=None,
    category_codes=None,
    user_uuids=None,
    solution_uuids=None,
    activity_uuids=None,
    cost_min=None,
    cost_max=None,
):
    qs1: Iterable[ClientSolution] = (
        ClientSolution.objects.filter(
            year=year,
            month=month,
            client__organization=org,
        )
        .select_related("client", "solution", "solution__category")
        .prefetch_related("logs")
    )
    if cost_min is not None:
        qs1 = qs1.filter(unit_cost__gte=cost_min)
    if cost_max is not None:
        qs1 = qs1.filter(unit_cost__lte=cost_max)

    qs2: Iterable[ClientActivity] = (
        ClientActivity.objects.filter(
            year=year,
            month=month,
            client__organization=org,
            is_executed=True,
            # Choosing activities that are not part of a package
            activity__solutions__isnull=True,
        )
        .select_related("client", "activity", "activity__category")
        .prefetch_related("logs")
    )
    if cost_min is not None:
        qs2 = qs2.filter(activity__unit_cost__gte=cost_min)
    if cost_max is not None:
        qs2 = qs2.filter(activity__unit_cost__lte=cost_max)

    if client_uuids:
        qs1 = qs1.filter(client__uuid__in=client_uuids)
        qs2 = qs2.filter(client__uuid__in=client_uuids)

    if category_codes:
        qs1 = qs1.filter(solution__category__code__in=category_codes)
        qs2 = qs2.filter(activity__category__code__in=category_codes)

    if user_uuids:
        qs1 = qs1.filter(client__program_manager__uuid__in=user_uuids)
        qs2 = qs2.filter(client__program_manager__uuid__in=user_uuids)

    if solution_uuids and activity_uuids:
        qs1 = qs1.filter(solution__uuid__in=solution_uuids)
        qs2 = qs2.filter(activity__uuid__in=activity_uuids)
    elif solution_uuids and not activity_uuids:
        qs1 = qs1.filter(solution__uuid__in=solution_uuids)
        qs2 = qs2.none()
    elif not solution_uuids and activity_uuids:
        qs1 = qs1.none()
        qs2 = qs2.filter(activity__uuid__in=activity_uuids)

    data = []

    for obj in qs1:
        row = [
            obj.client.name,
            obj.client.program_manager.name,
            obj.solution.name,
            obj.solution.category.name,
            obj.quantity,
            obj.unit_cost,
            obj.unit_cost_currency,
        ]
        logs = list(obj.logs.all()) or [None]
        for log in logs:
            data.append(
                [
                    *row,
                    log.date.day if log else None,
                    log.minutes_allocated if log else None,
                ]
            )

    for obj in qs2:
        row = [
            obj.client.name,
            obj.client.program_manager.name,
            obj.activity.name,
            obj.activity.category.name,
            obj.quantity,
            obj.activity.unit_cost,
            obj.activity.unit_cost_currency,
        ]
        logs = list(obj.logs.all()) or [None]
        for log in logs:
            data.append(
                [
                    *row,
                    log.date.day if log else None,
                    log.minutes_allocated if log else None,
                ]
            )

    return pd.DataFrame(
        data,
        columns=[
            REPORT_COLUMNS.CLIENT.value,
            REPORT_COLUMNS.PROGRAM_MANAGER.value,
            REPORT_COLUMNS.ACTIVITY_NAME.value,
            REPORT_COLUMNS.CATEGORY_NAME.value,
            REPORT_COLUMNS.QUANTITY.value,
            REPORT_COLUMNS.UNIT_COST.value,
            REPORT_COLUMNS.UNIT_COST_CURRENCY.value,
            REPORT_COLUMNS.LOG_DAY.value,
            REPORT_COLUMNS.LOG_MINUTES_ALLOCATED.value,
        ],
    )
