# -*- coding: utf-8 -*-
from django.db import models

from core.models import BaseModel
from organization.constants import CurrencyEnum, UnitCostTypeEnum
from organization.models.organization import Organization, OrganizationBusinessCategory


class Activity(BaseModel):
    class Meta:
        verbose_name_plural = "Activities"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "organization", "category"],
                condition=models.Q(deleted__isnull=True)
                & models.Q(client__isnull=True),
                name="organization_activity_name_organization_category_unique",
            ),
        ]

    name = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    unit_cost = models.IntegerField(
        null=True, blank=True, help_text="Cost of the Activity per unit type"
    )
    unit_cost_currency = models.CharField(max_length=3, choices=CurrencyEnum.choices)
    unit_cost_type = models.CharField(
        max_length=8,
        choices=UnitCostTypeEnum.choices,
        help_text="The cost type of the activity can be fixed, per hour etc",
    )
    category = models.ForeignKey(OrganizationBusinessCategory, on_delete=models.CASCADE)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="activities"
    )
    client = models.ForeignKey(
        "organization.Client",
        on_delete=models.CASCADE,
        related_name="activities",
        null=True,
        help_text="The client for which the activity is created. If null, the activity is for the organization.",
    )

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name


class Solution(BaseModel):
    name = models.CharField(max_length=64)

    category = models.ForeignKey(OrganizationBusinessCategory, on_delete=models.CASCADE)
    activities = models.ManyToManyField(Activity, related_name="solutions")
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="solutions"
    )

    def __str__(self):
        return self.name


class ActivityLog(BaseModel):
    class Meta:
        abstract = True

    minutes_allocated = models.SmallIntegerField(
        help_text="Number of minutes allocated for this activity",
    )
    date = models.DateField(
        help_text="Date when the activity was executed",
    )
    description = models.TextField(
        help_text="Optional explanation for the log", null=True, blank=True
    )

    def __str__(self):
        return f"{self.minutes_allocated} minutes"

    def __repr__(self):
        return f"{self.minutes_allocated} minutes"
