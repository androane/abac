# -*- coding: utf-8 -*-
from django.conf import settings
from django.shortcuts import redirect


def handler_404(request, exception):
    return redirect(settings.REACT_HOST)
