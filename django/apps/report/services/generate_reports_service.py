# -*- coding: utf-8 -*-
import io
from typing import Optional

import pandas as pd
from django.core.files.base import ContentFile
from django.utils.text import slugify

from organization.locales import CATEGORY_TRANSLATIONS, REPORT_COLUMNS_TRANSLATIONS
from report.constants import ReportTypeEnum
from report.models import UserReport
from report.services.denormalize_models_service import (
    REPORT_COLUMNS,
    get_flattened_report_data,
)
from user.models import User


def _get_excel_bytes_data_from_dataframe(df: pd.DataFrame) -> bytes:
    excel_file = io.BytesIO()
    df.to_excel(excel_file, index=False)
    return excel_file.getvalue()


def _translate_dataframe_values(df: pd.DataFrame) -> pd.DataFrame:
    df[REPORT_COLUMNS.CATEGORY_NAME] = df[REPORT_COLUMNS.CATEGORY_NAME].map(
        CATEGORY_TRANSLATIONS
    )
    df.rename(columns=REPORT_COLUMNS_TRANSLATIONS, inplace=True)
    return df


def _save_user_report(
    user: User, year: int, month: int, report_type: ReportTypeEnum, excel_bytes_data
) -> UserReport:
    org = user.organization

    filename = slugify(f"raport-{org.name}-{year}-{month}-{report_type}")

    try:
        user_report = UserReport.objects.get(user=user)
    except UserReport.DoesNotExist:
        pass
    else:
        user_report.hard_delete()
    finally:
        user_report = UserReport.objects.create(user=user)
        user_report.the_file.save(f"{filename}.xlsx", ContentFile(excel_bytes_data))
    return user_report


def generate_report(
    user: User,
    report_type: ReportTypeEnum,
    year: int,
    month: int,
    category_codes: list[str],
    user_uuids: list[str],
    solution_uuids: list[str],
    activity_uuids: list[str],
    cost_min: Optional[int] = None,
    cost_max: Optional[int] = None,
) -> UserReport:
    org = user.organization

    df = get_flattened_report_data(
        org,
        year,
        month,
        category_codes=category_codes,
        user_uuids=user_uuids,
        solution_uuids=solution_uuids,
        activity_uuids=activity_uuids,
        cost_min=cost_min,
        cost_max=cost_max,
    )
    sort_columns = [
        REPORT_COLUMNS.CLIENT,
        REPORT_COLUMNS.CATEGORY_NAME,
        REPORT_COLUMNS.LOG_DAY,
    ]

    if report_type == ReportTypeEnum.SOLUTIONS_AND_ACTIVITIES_INCLUDING_LOGS.value:
        pass
    elif report_type == ReportTypeEnum.SOLUTIONS_AND_ACTIVITIES_WITHOUT_LOGS.value:
        df = df.drop(
            columns=[REPORT_COLUMNS.LOG_DAY, REPORT_COLUMNS.LOG_MINUTES_ALLOCATED]
        ).drop_duplicates()
        sort_columns.remove(REPORT_COLUMNS.LOG_DAY)
    elif report_type == ReportTypeEnum.SUM_LOGGED_TIMES.value:
        pass

    df.sort_values(sort_columns, inplace=True)
    df = _translate_dataframe_values(df)

    excel_bytes_data = _get_excel_bytes_data_from_dataframe(df)

    return _save_user_report(user, year, month, report_type, excel_bytes_data)
