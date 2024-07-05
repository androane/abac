# -*- coding: utf-8 -*-
import logging

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from guardian.mixins import GuardianUserMixin

from core.models import BaseModel
from user.constants import UserRoleEnum
from user.managers import UserManager
from user.permissions import USER_MODEL_PERMISSIONS

logger = logging.getLogger(__name__)


class User(BaseModel, AbstractBaseUser, PermissionsMixin, GuardianUserMixin):
    USERNAME_FIELD = "email"

    objects = UserManager()

    email = models.EmailField("email address")
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
        "organization.Organization",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="users",
    )
    client = models.ForeignKey(
        "organization.Client", null=True, on_delete=models.CASCADE, related_name="users"
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
        permissions = tuple(
            (perm_codename, perm_name)
            for perm_codename, perm_name in USER_MODEL_PERMISSIONS.items()
        )

    def __str__(self):
        return f"{self.name} - {self.email}"

    def __repr__(self):
        return self.email

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def role(self):
        return UserRoleEnum.CLIENT.value if self.client_id else UserRoleEnum.PM.value

    def generate_client_user_email(self):
        # We fake generate an email so that the email is not mandatory when adding a client user
        return f"{self.uuid}@abacsoft.ro"
