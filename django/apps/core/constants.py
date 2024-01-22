# -*- coding: utf-8 -*-
from django.db import models


class BaseEnum(models.TextChoices):
    """
    All Enums in the app should inherit from this class. Each Enum choice has 3 properties
    name = "value", "label"

    Ex:
    class Status(models.TextChoices):
        IN_PROGRESS = 'IP', 'In Prog'

    Status.IN_PROGRESS.value == 'IP'
    Status.IN_PROGRESS.name == 'IN_PROGRESS'
    Status.IN_PROGRESS.label == 'In Prog'

    If the value of an enum is a single value, rather than a tuple, the label is generated from the name.
    https://docs.djangoproject.com/en/3.1/ref/models/fields/#field-choices-enum-auto-label

    Ex:
    class Status(models.TextChoices):
        IN_PROGRESS = 'IP'

    Status.IN_PROGRESS.value == 'IP'
    Status.IN_PROGRESS.name == 'IN_PROGRESS'
    Status.IN_PROGRESS.label == 'In Progress'

    Accessible properties:
        Enum.choices: returns [(choice.value, choice.label)]
        Enum.labels returns [choice.label]
        Enum.values: returns [choice.value]
        Enum.names: return [choice.name]
    """
