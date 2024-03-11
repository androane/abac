# -*- coding: utf-8 -*-
import os

import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload

from organization.constants import (
    ClientUserRoleEnum,
    CurrencyEnum,
    InvoiceStatusEnum,
    UnitCostTypeEnum,
)
from organization.models import (
    Activity,
    ActivityCategory,
    Client,
    ClientActivity,
    ClientActivityLog,
    ClientFile,
    ClientSolution,
    ClientUserProfile,
    Invoice,
    Organization,
    Solution,
)
from user.graphene.types import UserType

CurrencyEnumType = graphene.Enum.from_enum(CurrencyEnum)
UnitCostTypeEnumType = graphene.Enum.from_enum(UnitCostTypeEnum)
InvoiceStatusEnumType = graphene.Enum.from_enum(InvoiceStatusEnum)
ClientUserRoleEnumType = graphene.Enum.from_enum(ClientUserRoleEnum)


class SolutionType(DjangoObjectType):
    class Meta:
        model = Solution
        only_fields = (
            "uuid",
            "name",
            "category",
            "activities",
        )


class SolutionInput(graphene.InputObjectType):
    uuid = graphene.String()
    name = graphene.String(required=True)
    category_code = graphene.String(required=True)
    activity_uuids = graphene.List(graphene.NonNull(graphene.String), required=True)


class CategoryType(DjangoObjectType):
    class Meta:
        model = ActivityCategory
        only_fields = (
            "uuid",
            "name",
            "code",
        )


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


class ClientActivityLogType(DjangoObjectType):
    class Meta:
        model = ClientActivityLog
        only_fields = (
            "uuid",
            "date",
            "minutes_allocated",
            "description",
        )


class ClientActivityType(DjangoObjectType):
    class Meta:
        model = ClientActivity
        only_fields = (
            "uuid",
            "month",
            "year",
            "is_executed",
            "activity",
        )

    logs = graphene.List(graphene.NonNull(ClientActivityLogType), required=True)

    def resolve_activity(self, info, **kwargs):
        return info.context.activity_from_client_activity.load(self.activity_id)

    def resolve_logs(self, info, **kwargs):
        return info.context.logs_from_client_activity.load(self.id)


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        only_fields = (
            "uuid",
            "name",
        )

    solutions = graphene.List(graphene.NonNull(SolutionType), required=True)
    activities = graphene.List(graphene.NonNull(ActivityType), required=True)
    logo_url = graphene.NonNull(graphene.String)

    def resolve_logo_url(self, info):
        if self.logo:
            return self.logo.url

    def resolve_solutions(self, info, **kwargs):
        return self.solutions.all()

    def resolve_activities(self, info, **kwargs):
        return self.activities.filter(client__isnull=True).all()


class ClientSolutionType(DjangoObjectType):
    class Meta:
        model = ClientSolution
        only_fields = (
            "uuid",
            "unit_cost",
            "unit_cost_currency",
            "solution",
        )

    unit_cost_currency = CurrencyEnumType(required=True)


class TotalByCurrencyType(graphene.ObjectType):
    currency = CurrencyEnumType(required=True)
    total = graphene.Float(required=True)


class InvoiceType(DjangoObjectType):
    class Meta:
        model = Invoice
        only_fields = (
            "uuid",
            "month",
            "year",
            "date_sent",
        )

    totals_by_currency = graphene.List(
        graphene.NonNull(TotalByCurrencyType), required=True
    )

    def resolve_totals_by_currency(self, info, **kwargs):
        return [
            {
                "currency": currency,
                "total": total,
            }
            for currency, total in self.totals_by_currency.items()
        ]


class ActivityInput(graphene.InputObjectType):
    uuid = graphene.String()
    category_code = graphene.String(required=True)
    name = graphene.String(required=True)
    description = graphene.String()
    unit_cost = graphene.Int()
    unit_cost_currency = CurrencyEnumType(required=True)
    unit_cost_type = UnitCostTypeEnumType(required=True)


class ClientSolutionInput(graphene.InputObjectType):
    uuid = graphene.String()
    solution_uuid = graphene.String()
    unit_cost = graphene.Int(required=True)
    unit_cost_currency = CurrencyEnumType(required=True)


class ClientInput(graphene.InputObjectType):
    uuid = graphene.String()
    name = graphene.String(required=True)
    description = graphene.String()
    program_manager_uuid = graphene.String()
    spv_username = graphene.String()
    spv_password = graphene.String()
    cui = graphene.String()
    client_solutions = graphene.List(ClientSolutionInput, required=True)


class ClientActivityLogInput(graphene.InputObjectType):
    uuid = graphene.String()
    date = graphene.Date(required=True)
    description = graphene.String()
    minutes_allocated = graphene.Int(required=True)


class ClientActivityInput(graphene.InputObjectType):
    uuid = graphene.String()
    month = graphene.Int(required=True)
    year = graphene.Int(required=True)


class ClientFileType(DjangoObjectType):
    class Meta:
        model = ClientFile
        only_fields = (
            "uuid",
            "updated",
        )

    # Model properties
    url = graphene.NonNull(graphene.String)
    size = graphene.NonNull(graphene.Int)
    name = graphene.NonNull(graphene.String)

    def resolve_name(self, info):
        # Using os.path.basename to get rid of the path and only return the actual file name
        return os.path.basename(self.file.name)


class ClientFileInput(graphene.InputObjectType):
    file = Upload(required=True)


class ClientType(DjangoObjectType):
    class Meta:
        model = Client
        only_fields = (
            "uuid",
            "name",
            "description",
            "program_manager",
            "spv_username",
            "spv_password",
            "cui",
        )

    files = graphene.List(graphene.NonNull(ClientFileType), required=True)
    users = graphene.List(graphene.NonNull(UserType), required=True)
    activities = graphene.List(graphene.NonNull(ClientActivityType), required=True)
    client_solutions = graphene.List(
        graphene.NonNull(ClientSolutionType), required=True
    )

    def resolve_files(self, info, **kwargs):
        return self.files.all()

    def resolve_users(self, info, **kwargs):
        return get_user_model().objects.filter(
            organization=info.contenxt.user.organization, client_profile=self
        )

    def resolve_activities(self, info, **kwargs):
        return ClientActivity.objects.filter(client=self).all()

    def resolve_client_solutions(self, info, **kwargs):
        return self.client_solutions.all()


class ClientUserProfileType(DjangoObjectType):
    class Meta:
        model = ClientUserProfile
        only_fields = (
            "uuid",
            "ownership_percentage",
            "role",
            "spv_username",
            "spv_password",
            "phone_number",
        )

    role = ClientUserRoleEnumType()


class ClientUserInput(graphene.InputObjectType):
    uuid = graphene.String()
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    email = graphene.String()
    role = ClientUserRoleEnumType()
    ownership_percentage = graphene.Int()
    spv_username = graphene.String()
    spv_password = graphene.String()
    phone_number = graphene.String()
