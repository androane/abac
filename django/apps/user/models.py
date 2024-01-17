# -*- coding: utf-8 -*-
import logging

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.db import models
from simple_history.models import HistoricalRecords

from core.models import BaseModel

logger = logging.getLogger(__name__)


class User(BaseModel, AbstractBaseUser, PermissionsMixin):
    USERNAME_FIELD = "email"

    history = HistoricalRecords()
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
