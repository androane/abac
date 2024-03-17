# -*- coding: utf-8 -*-
from collections import defaultdict

import pendulum

from organization.constants import CurrencyEnum, InvoiceStatusEnum, UnitCostTypeEnum
from organization.models import Client, Invoice, Organization
from organization.models.activity import Activity


def get_client_invoice(
    client: Client,
    month: int,
    year: int,
) -> Invoice:
    # If year and month are not given, it means we need to create an invoice for the current month
    try:
        return client.invoices.get(month=month, year=year)
    except Invoice.DoesNotExist:
        # Create invoice for current month
        invoice = Invoice.objects.create(client=client, month=month, year=year)

    return invoice


def generate_invoice_items(invoice: Invoice) -> list[str]:
    client = invoice.client

    items = []

    client_solutions = client.client_solutions.filter(
        year=invoice.year, month=invoice.month
    ).all()
    for client_solution in client_solutions:
        items.append(
            {
                "name": client_solution.solution.name,
                "quantity": 1,
                "cost": client_solution.unit_cost,
                "currency": client_solution.unit_cost_currency,
            }
        )

    client_activities = (
        client.client_activities.filter(
            is_executed=True,
            month=invoice.month,
            year=invoice.year,
        )
        .select_related("activity", "activity__category")
        .all()
    )

    activity_items = defaultdict(lambda: defaultdict(int))
    for client_activity in client_activities:
        activity: Activity = client_activity.activity

        if activity.unit_cost_type == UnitCostTypeEnum.FIXED.value:
            cost = activity.unit_cost
        elif activity.unit_cost_type == UnitCostTypeEnum.HOURLY.value:
            cost = 0
            if activity.unit_cost:
                total_time = sum(
                    client_activity.logs.values_list("minutes_allocated", flat=True)
                )
                if total_time and activity.unit_cost:
                    cost = activity.unit_cost * total_time / 60

        activity_items[activity.category][activity.unit_cost_currency] += cost

    for category, data in activity_items.items():
        for currency, cost in data.items():
            items.append(
                {
                    "name": f"Servicii extra {category.get_translated_name()}",
                    "quantity": 1,
                    "cost": cost,
                    "currency": currency,
                }
            )

    for item in items:
        if item["currency"] != CurrencyEnum.RON.value:
            item["name"] = item["name"] + f" ({item.currency})"

    return items


def update_client_invoice_status(
    org: Organization, invoice_uuid: str, status: InvoiceStatusEnum
) -> Invoice:
    invoice = Invoice.objects.get(
        uuid=invoice_uuid,
        client__organization=org,
    )
    if status == InvoiceStatusEnum.SENT.value:
        invoice.date_sent = pendulum.now()
    elif status == InvoiceStatusEnum.DRAFT.value:
        invoice.date_sent = None

    invoice.save()
    return invoice
