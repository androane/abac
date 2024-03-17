# -*- coding: utf-8 -*-
import os

import graphene
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
from organization.models.client import ClientSolutionLog
from organization.services.client_invoice_service import (
    generate_invoice_items,
    get_client_invoice,
)
from user.graphene.types import UserType
from user.permissions import (
    UserPermissionsEnum,
    field_permission_required,
    permission_required,
)

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


class ClientSolutionLogType(DjangoObjectType):
    class Meta:
        model = ClientSolutionLog
        only_fields = (
            "uuid",
            "date",
            "minutes_allocated",
            "description",
        )


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
    logs = graphene.List(graphene.NonNull(ClientSolutionLogType), required=True)

    def resolve_logs(self, info, **kwargs):
        return info.context.logs_from_client_solution.load(self.id)


class TotalByCurrencyType(graphene.ObjectType):
    currency = CurrencyEnumType(required=True)
    total = graphene.Float(required=True)


class InvoiceItemType(graphene.ObjectType):
    name = graphene.String(required=True)
    quantity = graphene.Int(required=True)
    cost = graphene.Int(required=True)
    currency = CurrencyEnumType(required=True)


class InvoiceType(DjangoObjectType):
    class Meta:
        model = Invoice
        only_fields = (
            "uuid",
            "month",
            "year",
            "date_sent",
        )

    items = graphene.List(graphene.NonNull(InvoiceItemType), required=True)

    def resolve_items(self, info, **kwargs):
        return generate_invoice_items(self)


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
    unit_cost = graphene.Int()
    unit_cost_currency = CurrencyEnumType()


class ClientInput(graphene.InputObjectType):
    uuid = graphene.String()
    name = graphene.String(required=True)
    description = graphene.String()
    program_manager_uuid = graphene.String()
    spv_username = graphene.String()
    spv_password = graphene.String()
    cui = graphene.String()
    client_solutions = graphene.List(ClientSolutionInput, required=True)


class LogInput(graphene.InputObjectType):
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
    activity = graphene.NonNull(ClientActivityType, uuid=graphene.String(required=True))
    activities = graphene.List(
        graphene.NonNull(ClientActivityType),
        month=graphene.Int(required=True),
        year=graphene.Int(required=True),
        required=True,
    )
    solution = graphene.NonNull(ClientSolutionType, uuid=graphene.String(required=True))
    solutions = graphene.List(
        graphene.NonNull(ClientSolutionType),
        month=graphene.Int(),
        year=graphene.Int(),
        required=True,
    )
    invoice = graphene.NonNull(
        InvoiceType,
        month=graphene.Int(required=True),
        year=graphene.Int(required=True),
    )

    def resolve_files(self, info, **kwargs):
        return self.files.order_by("-created").all()

    def resolve_users(self, info, **kwargs):
        return self.users.all()

    def resolve_activity(self, info, **kwargs):
        return self.client_activities.get(uuid=kwargs.get("uuid"))

    @permission_required(
        UserPermissionsEnum.HAS_CLIENT_GENERAL_INFORMATION_ACCESS.value
    )
    def resolve_solution(self, info, **kwargs):
        return self.client_solutions.get(uuid=kwargs.get("uuid"))

    def resolve_activities(self, info, **kwargs):
        from organization.services.client_activity_service import get_client_activities

        return get_client_activities(self, **kwargs)

    def resolve_solutions(self, info, **kwargs):
        from organization.services.client_activity_service import get_client_solutions

        return get_client_solutions(self, **kwargs)

    @permission_required(UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS.value)
    def resolve_invoice(self, info, **kwargs):
        return get_client_invoice(self, **kwargs)


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
    clients = graphene.NonNull(graphene.List(graphene.NonNull(ClientType)))
    users = graphene.NonNull(graphene.List(graphene.NonNull(UserType)))

    def resolve_clients(self, info, **kwargs):
        return self.clients.order_by("name").all()

    def resolve_logo_url(self, info):
        if self.logo:
            return self.logo.url

    def resolve_users(self, info, **kwargs):
        return (
            self.users.filter(client__isnull=True)
            .exclude(email="mihai.zamfir90@gmail.com")
            .order_by("first_name", "last_name")
        )

    def resolve_solutions(self, info, **kwargs):
        return self.solutions.all()

    # No permission required for activities
    def resolve_activities(self, info, **kwargs):
        return self.activities.filter(client__isnull=True).all()


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

    @field_permission_required(
        UserPermissionsEnum.HAS_CLIENT_GENERAL_INFORMATION_ACCESS.value
    )
    def resolve_role(self, info, **kwargs):
        return self.role

    @field_permission_required(
        UserPermissionsEnum.HAS_CLIENT_GENERAL_INFORMATION_ACCESS.value
    )
    def resolve_spv_username(self, info, **kwargs):
        return self.spv_username

    @field_permission_required(
        UserPermissionsEnum.HAS_CLIENT_GENERAL_INFORMATION_ACCESS.value
    )
    def resolve_spv_password(self, info, **kwargs):
        return self.spv_password

    @field_permission_required(
        UserPermissionsEnum.HAS_CLIENT_GENERAL_INFORMATION_ACCESS.value
    )
    def resolve_ownership_percentage(self, info, **kwargs):
        return self.ownership_percentage


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
