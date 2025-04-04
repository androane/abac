# -*- coding: utf-8 -*-
from datetime import date

from django.db import models

from core.models import BaseModel
from organization.models.client import Client


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
