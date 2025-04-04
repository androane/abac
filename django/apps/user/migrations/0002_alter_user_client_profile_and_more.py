# -*- coding: utf-8 -*-
# Generated by Django 5.0.1 on 2024-01-31 08:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("organization", "0003_client_accounting_app_client_inventory_app_and_more"),
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="client_profile",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="user",
                to="organization.clientuserprofile",
            ),
        ),
        migrations.AlterField(
            model_name="historicaluser",
            name="client_profile",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                to="organization.clientuserprofile",
            ),
        ),
        migrations.RemoveField(
            model_name="historicalclientuserprofile",
            name="client",
        ),
        migrations.RemoveField(
            model_name="historicalclientuserprofile",
            name="history_user",
        ),
        migrations.DeleteModel(
            name="ClientUserProfile",
        ),
        migrations.DeleteModel(
            name="HistoricalClientUserProfile",
        ),
    ]
