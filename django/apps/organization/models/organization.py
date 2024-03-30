# -*- coding: utf-8 -*-
from django.db import models
from guardian.models import UserObjectPermissionBase

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


class OrganizationBusinessCategory(BaseModel):
    """e.g. Accounting, Human Resources etc."""

    VIEW_PERMISSION_CODENAME = "view_organizationbusinesscategory"

    class Meta:
        verbose_name_plural = "Organization Business Categories"

        constraints = [
            models.UniqueConstraint(
                fields=["name"],
                condition=models.Q(deleted__isnull=True),
                name="organization_organization_business_category_name_unique",
            ),
            models.UniqueConstraint(
                fields=["code"],
                condition=models.Q(deleted__isnull=True),
                name="organization_organization_business_category_code_unique",
            ),
        ]

    name = models.CharField(max_length=64)
    code = models.CharField(max_length=64)

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name


class Organization(BaseModel):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name"],
                condition=models.Q(deleted__isnull=True),
                name="organization_organization_name_unique",
            )
        ]

    categories = models.ManyToManyField(
        OrganizationBusinessCategory, related_name="organizations"
    )
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


class CategoryUserObjectPermission(UserObjectPermissionBase):
    content_object = models.ForeignKey(
        OrganizationBusinessCategory, on_delete=models.CASCADE
    )
