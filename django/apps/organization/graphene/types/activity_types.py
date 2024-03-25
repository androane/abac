# -*- coding: utf-8 -*-
import graphene
from graphene_django import DjangoObjectType

from api.permission_decorators import field_permission_required
from organization.graphene.types.enums import CurrencyEnumType, UnitCostTypeEnumType
from organization.models import Activity
from organization.models.activity import Solution
from user.permissions import UserPermissionsEnum


class ActivityType(DjangoObjectType):
    class Meta:
        model = Activity
        only_fields = (
            "uuid",
            "name",
            "description",
            "unit_cost",
            "unit_cost_currency",
            "unit_cost_type",
            "category",
        )

    unit_cost_currency = CurrencyEnumType(required=True)
    unit_cost_type = UnitCostTypeEnumType(required=True)

    @field_permission_required(
        UserPermissionsEnum.HAS_CLIENT_ACTIVITY_COSTS_ACCESS.value
    )
    def resolve_unit_cost(self, info, **kwargs):
        return self.unit_cost


class TotalByCurrencyType(graphene.ObjectType):
    currency = CurrencyEnumType(required=True)
    total = graphene.Float(required=True)


class SolutionType(DjangoObjectType):
    class Meta:
        model = Solution
        only_fields = (
            "uuid",
            "name",
            "category",
            "activities",
        )

    def resolve_activities(self, info, **kwargs):
        return info.context.activities_from_solution.load(self.id)


# INPUTS


class ActivityInput(graphene.InputObjectType):
    uuid = graphene.String()
    category_code = graphene.String(required=True)
    name = graphene.String(required=True)
    description = graphene.String()
    unit_cost = graphene.Int()
    unit_cost_currency = CurrencyEnumType(required=True)
    unit_cost_type = UnitCostTypeEnumType(required=True)


class SolutionInput(graphene.InputObjectType):
    uuid = graphene.String()
    name = graphene.String(required=True)
    category_code = graphene.String(required=True)
    activity_uuids = graphene.List(graphene.NonNull(graphene.String), required=True)


class LogInput(graphene.InputObjectType):
    uuid = graphene.String()
    date = graphene.Date(required=True)
    description = graphene.String()
    minutes_allocated = graphene.Int(required=True)
