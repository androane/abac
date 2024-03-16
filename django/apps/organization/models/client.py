# -*- coding: utf-8 -*-
from django.db import models

from core.models import BaseModel
from organization.constants import ClientUserRoleEnum, CurrencyEnum
from organization.models.activity import Activity, ActivityLog, Solution
from organization.models.organization import Organization


def client_file_path(instance, filename):
    return "/".join(
        [
            "organization",
            str(instance.client.organization.pk),
            "client",
            str(instance.client.pk),
            filename,
        ]
    )


class Client(BaseModel):
    """
    Client is a client of the organization.
    """

    class Meta:
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
    program_manager = models.ForeignKey(
        "user.User",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="clients",
    )
    cui = models.CharField(
        max_length=32, blank=True, null=True, help_text="CUI - Cod Unic de Identificare"
    )

    # Accounting specific fields
    spv_username = models.CharField(
        max_length=64, blank=True, null=True, help_text="SPV Username"
    )
    spv_password = models.CharField(
        max_length=64, blank=True, null=True, help_text="SPV Password"
    )
    inventory_app = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        help_text="Application they use to manage inventory",
    )
    accounting_app = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        help_text="Application they use for accounting",
    )

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name


class ClientFile(BaseModel):
    """
    ClientFile represents a file for a Client
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


class ClientUserProfile(BaseModel):
    user = models.OneToOneField(
        "user.User", on_delete=models.CASCADE, related_name="client_profile", null=True
    )
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="user_profiles"
    )

    phone_number = models.CharField(max_length=12, blank=True)

    ownership_percentage = models.SmallIntegerField(
        null=True,
        blank=True,
        help_text="What percentage of the organization does this user own?",
    )
    role = models.CharField(
        max_length=64,
        choices=ClientUserRoleEnum.choices,
        blank=True,
        null=True,
        help_text="Role in the organization",
    )

    # Accounting Specific Fields
    spv_username = models.CharField(
        max_length=64, blank=True, null=True, help_text="SPV Username"
    )
    spv_password = models.CharField(
        max_length=64, blank=True, null=True, help_text="SPV Password"
    )

    def __str__(self):
        return f"{self.client.name} - {self.user.name}"

    def __repr__(self):
        return f"{self.client.name} - {self.user.name}"


class ClientActivity(BaseModel):
    class Meta:
        verbose_name_plural = "Client Activities"
        constraints = [
            models.UniqueConstraint(
                fields=["month", "year", "client", "activity"],
                condition=models.Q(deleted__isnull=True),
                name="organization_client_activity_month_year_client_activity_unique",
            )
        ]

    month = models.SmallIntegerField(help_text="Month of the Activity")
    year = models.SmallIntegerField(help_text="Year of the Activity")
    is_executed = models.BooleanField(
        default=True, help_text="Is the activity executed?"
    )

    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="client_activities"
    )
    activity = models.ForeignKey(
        Activity, on_delete=models.CASCADE, related_name="client_activities"
    )

    def __str__(self):
        return f"{self.month}.{self.year} : {self.client.name} - {self.activity.name}"


class ClientSolution(BaseModel):
    class Meta:
        verbose_name_plural = "Client Activities"
        constraints = [
            models.UniqueConstraint(
                fields=["month", "year", "client", "solution"],
                condition=models.Q(deleted__isnull=True),
                name="organization_client_activity_month_year_client_solution_unique",
            )
        ]

    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="client_solutions"
    )
    solution = models.ForeignKey(Solution, on_delete=models.CASCADE)

    month = models.SmallIntegerField(
        help_text="Month of the Solution", null=True, blank=True
    )
    year = models.SmallIntegerField(
        help_text="Year of the Solution", null=True, blank=True
    )

    unit_cost = models.IntegerField(help_text="Cost/Price of the Solution")
    unit_cost_currency = models.CharField(max_length=3, choices=CurrencyEnum.choices)

    def __str__(self):
        suffix = ""
        if self.month:
            suffix = f" - {self.month}.{self.year}"

        return f"{self.client.name} - {self.solution.name} {suffix}"


class ClientActivityLog(ActivityLog):
    client_activity = models.ForeignKey(
        ClientActivity, on_delete=models.CASCADE, related_name="logs"
    )


class ClientSolutionLog(ActivityLog):
    client_solution = models.ForeignKey(
        ClientSolution, on_delete=models.CASCADE, related_name="logs"
    )
