# -*- coding: utf-8 -*-
import io

import pandas as pd
from django.core.files.base import ContentFile
from django.utils.text import slugify

from report.models import UserReport
from report.services.denormalize_models_service import (
    REPORT_COLUMNS,
    get_flattened_report_data,
)
from user.models import User

REPORT_COLUMNS_TO_LABELS = {
    REPORT_COLUMNS.CLIENT: "Client",
    REPORT_COLUMNS.PROGRAM_MANAGER: "Responsabil",
    REPORT_COLUMNS.ACTIVITY_NAME: "Serviciu",
    REPORT_COLUMNS.CATEGORY: "Domeniu",
    REPORT_COLUMNS.QUANTITY: "Cantitate",
    REPORT_COLUMNS.UNIT_COST: "Cost",
    REPORT_COLUMNS.UNIT_COST_CURRENCY: "Moneda",
    REPORT_COLUMNS.DAY: "Ziua",
    REPORT_COLUMNS.MINUTES_ALLOCATED: "Minute alocate",
}


def _get_excel_file_data_from_dataframe(df: pd.DataFrame):
    excel_file = io.BytesIO()
    df.to_excel(excel_file, index=False)
    excel_data = excel_file.getvalue()
    return ContentFile(excel_data)


def generate_report(user: User, year: int, month: int) -> UserReport:
    org = user.organization
    df = get_flattened_report_data(org, year, month)
    df.rename(columns=REPORT_COLUMNS_TO_LABELS)
    filename = slugify(f"raport-{org.name}-{year}-{month}")

    try:
        user_report = UserReport.objects.get(user=user)
    except UserReport.DoesNotExist:
        pass
    else:
        user_report.hard_delete()
    finally:
        user_report = UserReport.objects.create(user=user)
        user_report.the_file.save(
            f"{filename}.xlsx", _get_excel_file_data_from_dataframe(df)
        )

    return user_report
