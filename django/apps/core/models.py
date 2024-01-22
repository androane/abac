# -*- coding: utf-8 -*-
import shortuuid
from dirtyfields import DirtyFieldsMixin
from django.conf import settings
from django.db import models
from django.urls import reverse
from safedelete.models import HARD_DELETE, SafeDeleteModel
from simple_history.models import HistoricalRecords


def generate_uuid() -> str:
    return shortuuid.uuid()


class BaseModel(DirtyFieldsMixin, SafeDeleteModel):
    class Meta:
        abstract = True

    history = HistoricalRecords(inherit=True)

    uuid = models.CharField(max_length=32, default=generate_uuid, editable=False)
    created = models.DateTimeField(auto_now_add=True, blank=True)
    updated = models.DateTimeField(auto_now=True, blank=True)
    deleted = models.DateTimeField(null=True, blank=True, editable=False)

    @property
    def is_deleted(self) -> bool:
        return self.deleted is not None

    @property
    def admin_absolute_url(self) -> str:
        return f'{settings.DJANGO_HOST}{reverse(f"admin:{self._meta.app_label}_{self._meta.model_name}_change", args=(self.id,))}'

    def hard_delete(self, **kwargs) -> None:
        """Physically deletes object from the database.  Cannot undelete!"""
        super(BaseModel, self).delete(force_policy=HARD_DELETE, **kwargs)
