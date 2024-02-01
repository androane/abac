# -*- coding: utf-8 -*-
import binascii
import os


def get_file_extension(filename: str) -> str:
    _, extension = os.path.splitext(filename)
    return extension.lower()


def replace_filename(filename: str, new_filename=None) -> str:
    new_filename = new_filename or binascii.b2a_hex(os.urandom(10)).decode("utf-8")
    extension = get_file_extension(filename)
    return f"{new_filename}{extension}"
