# -*- coding: utf-8 -*-
class APIException(Exception):
    pass


INVALID_TOKEN = "INVALID_TOKEN"
USER_WRONG_EMAIL_OR_PASSWORD = "USER_WRONG_EMAIL_OR_PASSWORD"
USER_WRONG_PASSWORD = "USER_WRONG_PASSWORD"
CLIENT_ALREADY_EXISTS = "CLIENT_ALREADY_EXISTS"
