# -*- coding: utf-8 -*-
import pandas as pd

from organization.models.client import ClientActivity, ClientSolution


def get_flattened_report_data(
    org, year, month, client_uuids=None, category_uuids=None, program_manager_uuids=None
):
    qs1 = ClientSolution.objects.filter(
        year=year,
        month=month,
        client__organization=org,
    ).prefetch_related("logs")
    qs2 = ClientActivity.objects.filter(
        year=year,
        month=month,
        client__organization=org,
        is_executed=True,
    ).prefetch_related("logs")

    if client_uuids:
        qs1 = qs1.filter(client__uuid__in=client_uuids)
        qs2 = qs2.filter(client__uuid__in=client_uuids)

    if category_uuids:
        qs1 = qs1.filter(solution__category__uuid__in=category_uuids)
        qs2 = qs2.filter(activity__category__uuid__in=category_uuids)

    if program_manager_uuids:
        qs1 = qs1.filter(client__program_manager__uuid__in=program_manager_uuids)
        qs2 = qs2.filter(client__program_manager__uuid__in=program_manager_uuids)

    d = {
        "client": [],
        "activity_name": [],
        "category": [],
        "quantity": [],
        "unit_cost": [],
        "unit_cost_currency": [],
        "day": [],
        "minutes_allocated": [],
    }

    for obj in qs1:
        if obj.logs.all():
            for log in obj.logs.all():
                d["client"].append(obj.client.name)
                d["activity_name"].append(obj.solution.name)
                d["category"].append(obj.solution.category.name)
                d["quantity"].append(obj.quantity)
                d["unit_cost"].append(obj.unit_cost)
                d["unit_cost_currency"].append(obj.unit_cost_currency)
                d["day"].append(log.date.day)
                d["minutes_allocated"].append(log.minutes_allocated)
        else:
            d["client"].append(obj.client.name)
            d["activity_name"].append(obj.solution.name)
            d["category"].append(obj.solution.category.name)
            d["quantity"].append(obj.quantity)
            d["unit_cost"].append(obj.unit_cost)
            d["unit_cost_currency"].append(obj.unit_cost_currency)
            d["day"].append(None)
            d["minutes_allocated"].append(None)

    for obj in qs2:
        if obj.logs.all():
            for log in obj.logs.all():
                d["client"].append(obj.client.name)
                d["activity_name"].append(obj.activity.name)
                d["category"].append(obj.activity.category.name)
                d["quantity"].append(obj.quantity)
                d["unit_cost"].append(obj.activity.unit_cost)
                d["unit_cost_currency"].append(obj.activity.unit_cost_currency)
                d["day"].append(log.date.day)
                d["minutes_allocated"].append(log.minutes_allocated)
        else:
            d["client"].append(obj.client.name)
            d["activity_name"].append(obj.activity.name)
            d["category"].append(obj.activity.category.name)
            d["quantity"].append(obj.quantity)
            d["unit_cost"].append(obj.activity.unit_cost)
            d["unit_cost_currency"].append(obj.activity.unit_cost_currency)
            d["day"].append(None)
            d["minutes_allocated"].append(None)

    return pd.DataFrame(d)
