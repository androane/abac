# -*- coding: utf-8 -*-
from datetime import date

from django.db import models

from core.models import BaseModel
from organization.constants import CurrencyEnum


class Organization(BaseModel):
    name = models.CharField(max_length=128, unique=True)

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name


class Client(BaseModel):
    """
    Client is a client of the organization.
    """

    constraints = [
        models.UniqueConstraint(
            fields=["organization", "name"],
            condition=models.Q(deleted__isnull=True),
            name="organization_client_organization_name_unique",
        )
    ]

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="clients"
    )

    name = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    phone_number_1 = models.CharField(max_length=12, blank=True)
    phone_number_2 = models.CharField(max_length=12, blank=True)
    program_manager = models.ForeignKey(
        "user.User", on_delete=models.SET_NULL, blank=True, null=True
    )
    cui = models.CharField(
        max_length=32, blank=True, null=True, help_text="CUI - Cod Unic de Identificare"
    )

    # Accounting specific fields
    # inventory_app = models.CharField(max_length=128, blank=True, null=True, help_text="Application they use to manage inventory")
    # accounting_app = models.CharField(max_length=128, choices=AccountingAppEnum.choices, blank=True, null=True, help_text="Application they use for accounting")

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name


class Invoice(BaseModel):
    constraints = [
        models.UniqueConstraint(
            fields=["client", "name"],
            condition=models.Q(deleted__isnull=True),
            name="organization_invoice_client_month_year_unique",
        )
    ]

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


class InvoiceItem(BaseModel):
    """
    InvoiceItem is a line item on a customer organization invoice.
    """

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")

    description = models.TextField()
    unit_price = models.IntegerField(blank=True, null=True)
    unit_price_currency = models.CharField(
        max_length=3, choices=CurrencyEnum.choices, blank=True, null=True
    )
    item_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date when the invoice item was executed",
    )
    minutes_allocated = models.SmallIntegerField(
        blank=True,
        null=True,
        help_text="Number of minutes allocated to the customer for this invoice item",
    )
    is_recurring = models.BooleanField(
        default=False,
        help_text="Boolean indicating if this invoice item is a recurring item every month",
    )

    def __str__(self):
        return f'{self.invoice.date.strftime("%m/%Y")} / {self.description}'

    def __repr__(self):
        return f'{self.invoice.date.strftime("%m/%Y")} / {self.description}'

    @property
    def is_locked(self) -> bool:
        return self.invoice.is_locked


def client_file_path(instance, filename):
    return "/".join(
        [
            str(instance.client.organization.pk),
            str(instance.client.pk),
            filename,
        ]
    )


class ClientFile(BaseModel):
    """
    ClientClient is a file file for a Client
    """

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="files",
    )

    name = models.CharField(max_length=128, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(
        upload_to=client_file_path, help_text="File resource", null=True, blank=True
    )

    def __str__(self):
        return f"{self.client.name} - {self.name}"

    def __repr__(self):
        return f"{self.client.name} - {self.name}"

    @property
    def url(self):
        return self.file.url

    @property
    def size(self):
        return self.file.size
