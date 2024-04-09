# -*- coding: utf-8 -*-
from report.services.denormalize_models_service import REPORT_COLUMNS

REPORT_COLUMNS_TRANSLATIONS = {
    REPORT_COLUMNS.CLIENT: "Client",
    REPORT_COLUMNS.PROGRAM_MANAGER: "Responsabil",
    REPORT_COLUMNS.ACTIVITY_NAME: "Serviciu",
    REPORT_COLUMNS.CATEGORY_NAME: "Domeniu",
    REPORT_COLUMNS.QUANTITY: "Cantitate",
    REPORT_COLUMNS.UNIT_COST: "Cost",
    REPORT_COLUMNS.UNIT_COST_CURRENCY: "Moneda",
    REPORT_COLUMNS.DAY: "Ziua",
    REPORT_COLUMNS.MINUTES_ALLOCATED: "Minute alocate",
}


CATEGORY_TRANSLATIONS = {
    "Accounting": "Contabilitate",
    "Human Resources": "Resurse Umane",
}

MONTH_TRANSLATIONS = {
    1: "Ianuarie",
    2: "Februarie",
    3: "Martie",
    4: "Aprilie",
    5: "Mai",
    6: "Iunie",
    7: "Iulie",
    8: "August",
    9: "Septembrie",
    10: "Octombrie",
    11: "Noiembrie",
    12: "Decembrie",
}
