# -*- coding: utf-8 -*-
import io

import pandas as pd
from django.core.files.base import ContentFile
from django.utils.text import slugify

from organization.locales import CATEGORY_TRANSLATIONS, REPORT_COLUMNS_TRANSLATIONS
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


def _translate_dataframe_strings(df: pd.DataFrame) -> pd.DataFrame:
    df[REPORT_COLUMNS.CATEGORY_NAME] = df[REPORT_COLUMNS.CATEGORY_NAME].map(
        CATEGORY_TRANSLATIONS
    )
    df.rename(columns=REPORT_COLUMNS_TRANSLATIONS, inplace=True)
    return df


def _save_user_report(
    user: User, year: int, month: int, excel_bytes_data
) -> UserReport:
    org = user.organization

    filename = slugify(f"raport-{org.name}-{year}-{month}")

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


def _generate_dataframe_report(
    user: User, year: int, month: int, category_codes: list[str]
) -> pd.DataFrame:
    org = user.organization

    df = get_flattened_report_data(org, year, month)
    df = df[df[REPORT_COLUMNS.CATEGORY_CODE].isin(category_codes)]
    df.sort_values(
        [REPORT_COLUMNS.CLIENT, REPORT_COLUMNS.CATEGORY_NAME, REPORT_COLUMNS.DAY],
        inplace=True,
    )
    df = _translate_dataframe_strings(df)
    return df


def generate_report(
    user: User, year: int, month: int, category_codes: list[str]
) -> UserReport:
    df = _generate_dataframe_report(user, year, month, category_codes)

    excel_bytes_data = _get_excel_bytes_data_from_dataframe(df)

    return _save_user_report(user, year, month, excel_bytes_data)
