# -*- coding: utf-8 -*-
from collections import defaultdict
from datetime import date
from typing import TypedDict

from django.db import models

from core.models import BaseModel
from organization.constants import CurrencyEnum
from organization.models.client import Client


class TotalByCurrency(TypedDict):
    currency: CurrencyEnum
    total: float


class Invoice(BaseModel):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="invoices",
    )

    month = models.SmallIntegerField(help_text="Month of the invoice")
    year = models.SmallIntegerField(help_text="Year of the invoice")
    date_sent = models.DateField(
        null=True,
        blank=True,
        help_text="Date when the invoice was sent to the customer",
    )
    date_paid = models.DateField(
        null=True,
        blank=True,
        help_text="Date when the invoice was paid by the customer",
    )
    date_due = models.DateField(
        null=True,
        blank=True,
        help_text="Date when the invoice is due to be paid by the customer",
    )

    def __str__(self):
        return f"Invoice on {self.month}/{self.year} for {self.client.name}"

    def __repr__(self):
        return f"Invoice on {self.month}/{self.year} for {self.client.name}"

    @property
    def is_locked(self) -> bool:
        return self.date_sent is not None

    @property
    def date(self) -> date:
        return date(self.year, self.month, 1)

    @property
    def totals_by_currency(self) -> list[TotalByCurrency]:
        totals = defaultdict(float)
        for item in self.items.all():
            totals[item.unit_price_currency] += item.total
        return totals
