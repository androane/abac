# -*- coding: utf-8 -*-
import binascii
import os


def get_filename(filename: str) -> str:
    _, extension = os.path.splitext(filename)
    return f"{binascii.b2a_hex(os.urandom(10)).decode('utf-8')}{extension.lower()}"
