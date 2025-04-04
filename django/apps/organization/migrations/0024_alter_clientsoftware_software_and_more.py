# -*- coding: utf-8 -*-
# Generated by Django 5.0.1 on 2024-04-01 14:40

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("organization", "0023_clientuserprofile_show_in_group_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="clientsoftware",
            name="software",
            field=models.CharField(
                choices=[
                    ("ONE_C", "One C"),
                    ("ONE_C_ALIN", "One C Alin"),
                    ("SAGA", "Saga"),
                    ("NEXUS", "Nexus"),
                    ("TEAMAPP", "Teamapp"),
                    ("NEXTUP", "Nextup"),
                    ("WIND", "Wind"),
                    ("SMARTBILL", "Smartbill"),
                    ("SENIOR_ERP", "Senior Erp"),
                    ("SENIOR_ERP_CLIENT", "Senior Erp Client"),
                    ("SICO_FINANCIAR", "Sico Financiar"),
                    ("SICO_GESTIUNI", "Sico Gestiuni"),
                ],
                max_length=32,
            ),
        ),
        migrations.AlterField(
            model_name="historicalclientsoftware",
            name="software",
            field=models.CharField(
                choices=[
                    ("ONE_C", "One C"),
                    ("ONE_C_ALIN", "One C Alin"),
                    ("SAGA", "Saga"),
                    ("NEXUS", "Nexus"),
                    ("TEAMAPP", "Teamapp"),
                    ("NEXTUP", "Nextup"),
                    ("WIND", "Wind"),
                    ("SMARTBILL", "Smartbill"),
                    ("SENIOR_ERP", "Senior Erp"),
                    ("SENIOR_ERP_CLIENT", "Senior Erp Client"),
                    ("SICO_FINANCIAR", "Sico Financiar"),
                    ("SICO_GESTIUNI", "Sico Gestiuni"),
                ],
                max_length=32,
            ),
        ),
    ]
