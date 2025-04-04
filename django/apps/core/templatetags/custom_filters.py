# -*- coding: utf-8 -*-
from django import template

register = template.Library()


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key, "Sorry, no value found!")
