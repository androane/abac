# -*- coding: utf-8 -*-
from django.db import models

from core.models import BaseModel
from organization.constants import CurrencyEnum


class Organization(BaseModel):
    name = models.CharField(max_length=128, unique=True)

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name


class CustomerOrganization(BaseModel):
    """
    CustomerOrganization is a client of the organization.
    """

    constraints = [
        models.UniqueConstraint(
            fields=["organization", "name"],
            condition=models.Q(deleted__isnull=True),
            name="organization_organization_customer_organization_name_unique",
        )
    ]

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="customer_organizations"
    )
    phone_number_1 = models.CharField(max_length=12, blank=True)
    phone_number_2 = models.CharField(max_length=12, blank=True)
    program_manager = models.ForeignKey(
        "user.User", on_delete=models.SET_NULL, blank=True, null=True
    )

    name = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name


class InvoiceItem(BaseModel):
    """
    CustomerOrganizationInvoiceItem is a line item on a customer organization invoice.
    """

    customer_organization = models.ForeignKey(
        CustomerOrganization,
        on_delete=models.CASCADE,
        related_name="customer_organization_invoice_items",
    )

    description = models.TextField()
    unit_price = models.IntegerField(blank=True, null=True)
    unit_price_currency = models.CharField(
        max_length=3, choices=CurrencyEnum.choices, blank=True, null=True
    )
    date_sent = models.DateField(
        null=True,
        blank=True,
        help_text="Date when the invoice was sent to the customer",
    )
    minutes_allocated = models.SmallIntegerField(
        blank=True,
        null=True,
        help_text="Number of minutes allocated to the customer for this invoice item",
    )
    is_fixed_cost = models.BooleanField(
        default=False,
        help_text="Boolean indicating if this invoice item is a fixed cost or not. For example monthly recurring invoices are fixed",
    )

    def __str__(self):
        return self.description

    def __repr__(self):
        return self.description
