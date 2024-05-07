# -*- coding: utf-8 -*-
from collections import defaultdict
from typing import Iterable

import pendulum

from organization.constants import InvoiceStatusEnum
from organization.models import Client, Invoice, Organization
from organization.models.activity import Activity
from organization.models.client import ClientActivity, ClientSolution
from organization.services.category_permission_service import get_category_ids_for_user
from user.models import User


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


def generate_invoice_items(user: User, invoice: Invoice) -> list[str]:
    client = invoice.client

    items = []

    category_ids_for_user = get_category_ids_for_user(user)

    client_solutions: Iterable[ClientSolution] = (
        client.client_solutions.filter(
            year=invoice.year,
            month=invoice.month,
            solution__category_id__in=category_ids_for_user,
        )
        .select_related("solution")
        .all()
    )

    for client_solution in client_solutions:
        items.append(
            {
                "solution_name": client_solution.solution.name,
                "quantity": client_solution.quantity,
                "cost": client_solution.total_cost,
                "currency": client_solution.unit_cost_currency,
                "category": client_solution.solution.category,
            }
        )

    client_activities: Iterable[ClientActivity] = (
        client.client_activities.filter(
            is_executed=True,
            month=invoice.month,
            year=invoice.year,
            activity__category_id__in=category_ids_for_user,
        )
        .select_related("activity", "activity__category")
        .prefetch_related("logs")
    ).all()

    activity_items = defaultdict(lambda: defaultdict(int))
    for client_activity in client_activities:
        activity: Activity = client_activity.activity

        activity_items[activity.category][
            activity.unit_cost_currency
        ] += client_activity.total_cost

    for category, data in activity_items.items():
        for currency, cost in data.items():
            items.append(
                {
                    "solution_name": None,
                    "category": category,
                    "quantity": 1,
                    "cost": cost,
                    "currency": currency,
                }
            )

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
