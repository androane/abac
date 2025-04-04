# -*- coding: utf-8 -*-
# Generated by Django 5.0.1 on 2024-03-23 14:31

import dirtyfields.dirtyfields
import django.db.models.deletion
import simple_history.models
from django.conf import settings
from django.db import migrations, models

import core.models


class Migration(migrations.Migration):
    dependencies = [
        (
            "organization",
            "0017_clientactivity_quantity_clientsolution_quantity_and_more",
        ),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="clientsolution",
            options={},
        ),
        migrations.AlterModelOptions(
            name="historicalclientsolution",
            options={
                "get_latest_by": ("history_date", "history_id"),
                "ordering": ("-history_date", "-history_id"),
                "verbose_name": "historical client solution",
                "verbose_name_plural": "historical client solutions",
            },
        ),
        migrations.CreateModel(
            name="ClientSoftware",
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
                    "software",
                    models.CharField(
                        choices=[("ONE_C", "One C"), ("SAGA", "Saga")], max_length=32
                    ),
                ),
                ("username", models.CharField(blank=True, max_length=64, null=True)),
                ("password", models.CharField(blank=True, max_length=64, null=True)),
                (
                    "client",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="softwares",
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
            name="HistoricalClientSoftware",
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
                    "software",
                    models.CharField(
                        choices=[("ONE_C", "One C"), ("SAGA", "Saga")], max_length=32
                    ),
                ),
                ("username", models.CharField(blank=True, max_length=64, null=True)),
                ("password", models.CharField(blank=True, max_length=64, null=True)),
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
                "verbose_name": "historical client software",
                "verbose_name_plural": "historical client softwares",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
