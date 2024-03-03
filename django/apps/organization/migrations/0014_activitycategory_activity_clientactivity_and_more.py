# -*- coding: utf-8 -*-
# Generated by Django 5.0.1 on 2024-03-03 15:00

import dirtyfields.dirtyfields
import django.db.models.deletion
import simple_history.models
from django.conf import settings
from django.db import migrations, models

import core.models


class Migration(migrations.Migration):
    dependencies = [
        ("organization", "0013_remove_historicalinvoiceitem_organization_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ActivityCategory",
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
                ("name", models.CharField(max_length=64)),
                ("code", models.CharField(max_length=64)),
            ],
            options={
                "verbose_name_plural": "Activity Categories",
            },
            bases=(dirtyfields.dirtyfields.DirtyFieldsMixin, models.Model),
        ),
        migrations.CreateModel(
            name="Activity",
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
                (
                    "is_custom",
                    models.BooleanField(
                        help_text="Is this a custom activity for the client? If not, it is an org-level activity"
                    ),
                ),
                (
                    "unit_cost",
                    models.IntegerField(
                        blank=True,
                        help_text="Cost of the Activity per unit type",
                        null=True,
                    ),
                ),
                (
                    "unit_cost_currency",
                    models.CharField(
                        choices=[("RON", "Ron"), ("EUR", "Eur"), ("USD", "Usd")],
                        max_length=3,
                    ),
                ),
                (
                    "unit_cost_type",
                    models.CharField(
                        choices=[("FIXED", "Fixed"), ("HOURLY", "Hourly")],
                        help_text="The cost type of the activity can be fixed, per hour etc",
                        max_length=8,
                    ),
                ),
                (
                    "organization",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="activities",
                        to="organization.organization",
                    ),
                ),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="organization.activitycategory",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Activities",
            },
            bases=(dirtyfields.dirtyfields.DirtyFieldsMixin, models.Model),
        ),
        migrations.CreateModel(
            name="ClientActivity",
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
                (
                    "quantity",
                    models.SmallIntegerField(
                        default=1,
                        help_text="How many of these items are on the invoice",
                    ),
                ),
                (
                    "minutes_allocated",
                    models.SmallIntegerField(
                        blank=True,
                        help_text="Number of minutes allocated to the customer for this activity",
                        null=True,
                    ),
                ),
                (
                    "date",
                    models.DateField(
                        blank=True,
                        help_text="Date when the activity was executed",
                        null=True,
                    ),
                ),
                (
                    "activity",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="organization.activity",
                    ),
                ),
                (
                    "client",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="organization.client",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
            bases=(dirtyfields.dirtyfields.DirtyFieldsMixin, models.Model),
        ),
        migrations.CreateModel(
            name="HistoricalActivity",
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
                (
                    "is_custom",
                    models.BooleanField(
                        help_text="Is this a custom activity for the client? If not, it is an org-level activity"
                    ),
                ),
                (
                    "unit_cost",
                    models.IntegerField(
                        blank=True,
                        help_text="Cost of the Activity per unit type",
                        null=True,
                    ),
                ),
                (
                    "unit_cost_currency",
                    models.CharField(
                        choices=[("RON", "Ron"), ("EUR", "Eur"), ("USD", "Usd")],
                        max_length=3,
                    ),
                ),
                (
                    "unit_cost_type",
                    models.CharField(
                        choices=[("FIXED", "Fixed"), ("HOURLY", "Hourly")],
                        help_text="The cost type of the activity can be fixed, per hour etc",
                        max_length=8,
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
                    "category",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="organization.activitycategory",
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
                "verbose_name": "historical activity",
                "verbose_name_plural": "historical Activities",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name="HistoricalActivityCategory",
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
                ("name", models.CharField(max_length=64)),
                ("code", models.CharField(max_length=64)),
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
                "verbose_name": "historical activity category",
                "verbose_name_plural": "historical Activity Categories",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name="HistoricalClientActivity",
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
                (
                    "quantity",
                    models.SmallIntegerField(
                        default=1,
                        help_text="How many of these items are on the invoice",
                    ),
                ),
                (
                    "minutes_allocated",
                    models.SmallIntegerField(
                        blank=True,
                        help_text="Number of minutes allocated to the customer for this activity",
                        null=True,
                    ),
                ),
                (
                    "date",
                    models.DateField(
                        blank=True,
                        help_text="Date when the activity was executed",
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
                    "activity",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="organization.activity",
                    ),
                ),
                (
                    "client",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="organization.client",
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
                "verbose_name": "historical client activity",
                "verbose_name_plural": "historical client activitys",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
