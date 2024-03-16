# -*- coding: utf-8 -*-
from django.db import models

from core.models import BaseModel
from core.utils import replace_filename


def organization_logo_path(instance, filename):
    return "/".join(
        [
            "organization",
            str(instance.pk),
            replace_filename(filename, "logo"),
        ]
    )


class Organization(BaseModel):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name"],
                condition=models.Q(deleted__isnull=True),
                name="organization_organization_name_unique",
            )
        ]

    name = models.CharField(max_length=128)
    logo = models.FileField(
        upload_to=organization_logo_path,
        help_text="Organization logo",
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name


class ActivityCategory(BaseModel):
    """e.g. Accounting, Human Resources etc."""

    class Meta:
        verbose_name_plural = "Categories"

        constraints = [
            models.UniqueConstraint(
                fields=["name"],
                condition=models.Q(deleted__isnull=True),
                name="organization_activity_category_name_unique",
            ),
            models.UniqueConstraint(
                fields=["code"],
                condition=models.Q(deleted__isnull=True),
                name="organization_activity_category_code_unique",
            ),
        ]

    name = models.CharField(max_length=64)
    code = models.CharField(max_length=64)

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name

    def get_translated_name(self):
        if self.code == "accounting":
            return "Contabilitate"
        elif self.code == "hr":
            return "Resurse Umane"
        return ""
