# -*- coding: utf-8 -*-
# Generated by Django 5.0.1 on 2024-02-19 14:30

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("organization", "0008_historicalinvoiceitem_name_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="historicalinvoiceitem",
            name="quantity",
            field=models.SmallIntegerField(
                default=1, help_text="How many of these items are on the invoice"
            ),
        ),
        migrations.AddField(
            model_name="invoiceitem",
            name="quantity",
            field=models.SmallIntegerField(
                default=1, help_text="How many of these items are on the invoice"
            ),
        ),
    ]
