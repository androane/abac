# -*- coding: utf-8 -*-
from django.http import HttpResponse


class HttpResponseUnauthorized(HttpResponse):
    status_code = 401
