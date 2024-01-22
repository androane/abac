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
    program_manager = models.ForeignKey(
        "user.User", on_delete=models.SET_NULL, blank=True, null=True
    )

    name = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    monthly_invoice_ammount = models.IntegerField(blank=True, null=True)
    monthly_invoice_currency = models.CharField(
        max_length=3, choices=CurrencyEnum.choices, blank=True, null=True
    )

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
