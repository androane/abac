# -*- coding: utf-8 -*-
from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from report.models import UserReport


@admin.register(UserReport)
class UserReportAdmin(SimpleHistoryAdmin):
    list_display = ("user", "the_file")
