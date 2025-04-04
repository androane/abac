# -*- coding: utf-8 -*-
from django.db import models
from guardian.models import UserObjectPermissionBase

from core.models import BaseModel
from organization.constants import (
    ClientFileTypeEnum,
    ClientUserRoleEnum,
    CurrencyEnum,
    SoftwareEnum,
    UnitCostTypeEnum,
)
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


class ClientGroup(BaseModel):
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="client_groups"
    )
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name


class Client(BaseModel):
    """
    Client is a client of the organization.
    """

    VIEW_PERMISSION_CODENAME = "view_client"

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
    group = models.ForeignKey(
        ClientGroup,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="clients",
        help_text="Multiple Clients can be a part of the same group of clients",
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
    type = models.CharField(
        max_length=64,
        choices=ClientFileTypeEnum.choices,
        blank=True,
        null=True,
        help_text="FIle Type. If not specified, it's a general file",
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
    show_in_group = models.BooleanField(
        default=False,
        help_text="If true, the user will show for all clients in the same group",
    )

    # Accounting Specific Fields
    spv_username = models.CharField(
        max_length=64, blank=True, null=True, help_text="SPV Username"
    )
    spv_password = models.CharField(
        max_length=64, blank=True, null=True, help_text="SPV Password"
    )
    spv_email = models.EmailField(blank=True, null=True, help_text="SPV Email")

    def __str__(self):
        return f"ClientUserProfile: {self.user.name}"

    def __repr__(self):
        return f"ClientUserProfile: {self.user.name}"


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
    quantity = models.SmallIntegerField(help_text="Quantity of the Activity", default=1)
    is_executed = models.BooleanField(
        default=True, help_text="Is the activity executed?"
    )
    is_recurrent = models.BooleanField(
        default=False, help_text="Is the activity recurrent?"
    )

    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="client_activities"
    )
    activity = models.ForeignKey(
        Activity, on_delete=models.CASCADE, related_name="client_activities"
    )

    def __str__(self):
        return f"{self.month}.{self.year} : {self.client.name} - {self.activity.name}"

    @property
    def total_cost(self) -> float:
        activity: Activity = self.activity

        if not activity.unit_cost:
            return 0

        # FIXED
        if activity.unit_cost_type == UnitCostTypeEnum.FIXED.value:
            return activity.unit_cost * self.quantity

        # HOURLY
        cost = 0
        total_time = sum(self.logs.values_list("minutes_allocated", flat=True))
        if total_time and activity.unit_cost:
            cost = activity.unit_cost * total_time / 60

        return cost


class ClientSolution(BaseModel):
    class Meta:
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

    # When month and year are null, it means it's the default solution for the company, not specific to a date
    month = models.SmallIntegerField(
        help_text="Month of the Solution", null=True, blank=True
    )
    year = models.SmallIntegerField(
        help_text="Year of the Solution", null=True, blank=True
    )
    quantity = models.SmallIntegerField(help_text="Quantity of the Activity", default=1)

    unit_cost = models.IntegerField(help_text="Cost/Price of the Solution")
    unit_cost_currency = models.CharField(max_length=3, choices=CurrencyEnum.choices)

    def __str__(self):
        suffix = ""
        if self.month:
            suffix = f" - {self.month}.{self.year}"

        return f"{self.client.name} - {self.solution} {suffix}"

    @property
    def total_cost(self):
        return self.unit_cost * self.quantity


class ClientActivityLog(ActivityLog):
    client_activity = models.ForeignKey(
        ClientActivity, on_delete=models.CASCADE, related_name="logs"
    )


class ClientSolutionLog(ActivityLog):
    client_solution = models.ForeignKey(
        ClientSolution, on_delete=models.CASCADE, related_name="logs"
    )


class ClientUserObjectPermission(UserObjectPermissionBase):
    content_object = models.ForeignKey(Client, on_delete=models.CASCADE)


class ClientSoftware(BaseModel):
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="softwares"
    )
    software = models.CharField(max_length=32, choices=SoftwareEnum.choices)
    username = models.CharField(max_length=64, blank=True, null=True)
    password = models.CharField(max_length=64, blank=True, null=True)

    def __str__(self):
        return f"{self.client.name} - {self.software}"
