# -*- coding: utf-8 -*-
# Generated by Django 5.0.1 on 2024-01-21 22:03

import dirtyfields.dirtyfields
import django.db.models.deletion
import simple_history.models
from django.conf import settings
from django.db import migrations, models

import core.models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Organization",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "deleted_by_cascade",
                    models.BooleanField(default=False, editable=False),
                ),
                (
                    "uuid",
                    models.CharField(
                        default=core.models.generate_uuid, editable=False, max_length=32
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("updated", models.DateTimeField(auto_now=True)),
                (
                    "deleted",
                    models.DateTimeField(blank=True, editable=False, null=True),
                ),
                ("name", models.CharField(max_length=128, unique=True)),
            ],
            options={
                "abstract": False,
            },
            bases=(dirtyfields.dirtyfields.DirtyFieldsMixin, models.Model),
        ),
        migrations.CreateModel(
            name="HistoricalOrganization",
            fields=[
                (
                    "id",
                    models.IntegerField(
                        auto_created=True, blank=True, db_index=True, verbose_name="ID"
                    ),
                ),
                (
                    "deleted_by_cascade",
                    models.BooleanField(default=False, editable=False),
                ),
                (
                    "uuid",
                    models.CharField(
                        default=core.models.generate_uuid, editable=False, max_length=32
                    ),
                ),
                ("created", models.DateTimeField(blank=True, editable=False)),
                ("updated", models.DateTimeField(blank=True, editable=False)),
                (
                    "deleted",
                    models.DateTimeField(blank=True, editable=False, null=True),
                ),
                ("name", models.CharField(db_index=True, max_length=128)),
                ("history_id", models.AutoField(primary_key=True, serialize=False)),
                ("history_date", models.DateTimeField(db_index=True)),
                ("history_change_reason", models.CharField(max_length=100, null=True)),
                (
                    "history_type",
                    models.CharField(
                        choices=[("+", "Created"), ("~", "Changed"), ("-", "Deleted")],
                        max_length=1,
                    ),
                ),
                (
                    "history_user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "historical organization",
                "verbose_name_plural": "historical organizations",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name="HistoricalCustomerOrganization",
            fields=[
                (
                    "id",
                    models.IntegerField(
                        auto_created=True, blank=True, db_index=True, verbose_name="ID"
                    ),
                ),
                (
                    "deleted_by_cascade",
                    models.BooleanField(default=False, editable=False),
                ),
                (
                    "uuid",
                    models.CharField(
                        default=core.models.generate_uuid, editable=False, max_length=32
                    ),
                ),
                ("created", models.DateTimeField(blank=True, editable=False)),
                ("updated", models.DateTimeField(blank=True, editable=False)),
                (
                    "deleted",
                    models.DateTimeField(blank=True, editable=False, null=True),
                ),
                ("name", models.CharField(max_length=128)),
                ("description", models.TextField(blank=True, null=True)),
                ("monthly_invoice_ammount", models.IntegerField(blank=True, null=True)),
                (
                    "monthly_invoice_currency",
                    models.CharField(
                        blank=True,
                        choices=[("RON", "Ron"), ("EUR", "Eur"), ("USD", "Usd")],
                        max_length=3,
                        null=True,
                    ),
                ),
                ("history_id", models.AutoField(primary_key=True, serialize=False)),
                ("history_date", models.DateTimeField(db_index=True)),
                ("history_change_reason", models.CharField(max_length=100, null=True)),
                (
                    "history_type",
                    models.CharField(
                        choices=[("+", "Created"), ("~", "Changed"), ("-", "Deleted")],
                        max_length=1,
                    ),
                ),
                (
                    "history_user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "program_manager",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "organization",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="organization.organization",
                    ),
                ),
            ],
            options={
                "verbose_name": "historical customer organization",
                "verbose_name_plural": "historical customer organizations",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name="CustomerOrganization",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "deleted_by_cascade",
                    models.BooleanField(default=False, editable=False),
                ),
                (
                    "uuid",
                    models.CharField(
                        default=core.models.generate_uuid, editable=False, max_length=32
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("updated", models.DateTimeField(auto_now=True)),
                (
                    "deleted",
                    models.DateTimeField(blank=True, editable=False, null=True),
                ),
                ("name", models.CharField(max_length=128)),
                ("description", models.TextField(blank=True, null=True)),
                ("monthly_invoice_ammount", models.IntegerField(blank=True, null=True)),
                (
                    "monthly_invoice_currency",
                    models.CharField(
                        blank=True,
                        choices=[("RON", "Ron"), ("EUR", "Eur"), ("USD", "Usd")],
                        max_length=3,
                        null=True,
                    ),
                ),
                (
                    "program_manager",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "organization",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="organization.organization",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
            bases=(dirtyfields.dirtyfields.DirtyFieldsMixin, models.Model),
        ),
    ]
