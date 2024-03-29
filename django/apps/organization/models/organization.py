# -*- coding: utf-8 -*-
from typing import TYPE_CHECKING, Optional

from django.db import models
from guardian.models import UserObjectPermissionBase

from core.models import BaseModel
from core.utils import replace_filename
from user.permissions import UserPermissionsEnum

if TYPE_CHECKING:
    from user.models import User


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


class CategoryUserObjectPermissionManager(models.Manager):
    def get_category_ids_for_user(
        self, user: "User", permission_codename: Optional[str] = None
    ):
        if user.has_perm(f"user.{UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value}"):
            return list(user.organization.categories.values_list("id", flat=True))

        qs = self.filter(user=user)

        if permission_codename and not user.has_perm(
            f"user.{UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value}"
        ):
            qs = qs.filter(permission__codename=permission_codename)

        return list(qs.values_list("content_object_id", flat=True))


class CategoryUserObjectPermission(UserObjectPermissionBase):
    objects = CategoryUserObjectPermissionManager()

    content_object = models.ForeignKey(
        OrganizationBusinessCategory, on_delete=models.CASCADE
    )
