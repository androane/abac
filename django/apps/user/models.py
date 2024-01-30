# -*- coding: utf-8 -*-
import logging

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from core.models import BaseModel
from user.constants import ClientUserRoleEnum
from user.managers import UserManager

logger = logging.getLogger(__name__)


class User(BaseModel, AbstractBaseUser, PermissionsMixin):
    USERNAME_FIELD = "email"

    objects = UserManager()

    email = models.EmailField("email address", db_collation="case_insensitive")
    first_name = models.CharField("first name", max_length=64, blank=True)
    last_name = models.CharField("last name", max_length=64, blank=True)
    title = models.CharField("job title", max_length=128, blank=True, null=True)
    is_staff = models.BooleanField(
        "staff status",
        default=False,
        help_text="Designates whether the user can log into this admin site.",
    )
    is_active = models.BooleanField(
        "active",
        default=True,
        help_text=(
            "Designates whether this user should be treated as "
            "active. Unselect this instead of deleting accounts."
        ),
    )
    organization = models.ForeignKey(
        "organization.Organization", null=True, on_delete=models.CASCADE
    )
    client_profile = models.ForeignKey(
        "user.ClientUserProfile",
        null=True,
        on_delete=models.CASCADE,
        related_name="user",
    )

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        constraints = [
            models.UniqueConstraint(
                fields=["email"],
                condition=models.Q(deleted__isnull=True),
                name="users_user_email_uniq_hbcdef",
            )
        ]

    def __str__(self):
        return f"{self.name} - {self.email}"

    def __repr__(self):
        return self.email

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"


class ClientUserProfile(BaseModel):
    client = models.ForeignKey("organization.Client", on_delete=models.CASCADE)
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
