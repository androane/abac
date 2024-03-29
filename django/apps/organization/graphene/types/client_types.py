# -*- coding: utf-8 -*-
import os

import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload

from api.permission_decorators import field_permission_required, permission_required
from organization.graphene.types.enums import (
    ClientUserRoleEnumType,
    CurrencyEnumType,
    SoftwareEnumType,
)
from organization.graphene.types.invoice_types import InvoiceType
from organization.models import Client, ClientActivity, ClientActivityLog, ClientSolution
from organization.models.client import (
    ClientFile,
    ClientGroup,
    ClientSoftware,
    ClientSolutionLog,
    ClientUserProfile,
)
from organization.services.client_invoice_service import get_client_invoice
from organization.services.client_users_service import get_client_users
from user.graphene.types import UserType
from user.permissions import UserPermissionsEnum


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
            "quantity",
        )

    logs = graphene.List(graphene.NonNull(ClientActivityLogType), required=True)

    def resolve_activity(self, info, **kwargs):
        return info.context.activity_loader.load(self.activity_id)

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
            "quantity",
        )

    unit_cost = graphene.Int()
    unit_cost_currency = CurrencyEnumType(required=True)
    logs = graphene.List(graphene.NonNull(ClientSolutionLogType), required=True)

    def resolve_solution(self, info, **kwargs):
        return info.context.solution_loader.load(self.solution_id)

    def resolve_logs(self, info, **kwargs):
        return info.context.logs_from_client_solution.load(self.id)

    @field_permission_required(
        UserPermissionsEnum.HAS_CLIENT_ACTIVITY_COSTS_ACCESS.value
    )
    def resolve_unit_cost(self, info, **kwargs):
        return self.unit_cost


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


class ClientSoftwareType(DjangoObjectType):
    class Meta:
        model = ClientSoftware
        only_fields = (
            "uuid",
            "software",
            "username",
            "password",
        )

    software = SoftwareEnumType(required=True)


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
            "group",
        )

    files = graphene.List(graphene.NonNull(ClientFileType), required=True)
    users = graphene.List(graphene.NonNull(UserType), required=True)
    activities = graphene.List(
        graphene.NonNull(ClientActivityType),
        month=graphene.Int(required=True),
        year=graphene.Int(required=True),
        required=True,
    )
    activity = graphene.NonNull(ClientActivityType, uuid=graphene.String(required=True))
    solutions = graphene.List(
        graphene.NonNull(ClientSolutionType),
        month=graphene.Int(),
        year=graphene.Int(),
        required=True,
    )
    solution = graphene.NonNull(ClientSolutionType, uuid=graphene.String(required=True))
    invoice = graphene.NonNull(
        InvoiceType,
        month=graphene.Int(required=True),
        year=graphene.Int(required=True),
    )
    softwares = graphene.List(graphene.NonNull(ClientSoftwareType), required=True)

    def resolve_files(self, info, **kwargs):
        return self.files.order_by("-created").all()

    def resolve_program_manager(self, info, **kwargs):
        return info.context.program_manager_loader.load(self.program_manager_id)

    def resolve_users(self, info, **kwargs):
        return get_client_users(info.context.user, self)

    def resolve_activities(self, info, **kwargs):
        from organization.services.client_activity_service import get_client_activities

        return get_client_activities(info.context.user, self, **kwargs)

    def resolve_activity(self, info, **kwargs):
        return self.client_activities.get(uuid=kwargs.get("uuid"))

    def resolve_solutions(self, info, **kwargs):
        from organization.services.client_activity_service import get_client_solutions

        return get_client_solutions(info.context.user, self, **kwargs)

    @permission_required(UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS.value)
    def resolve_solution(self, info, **kwargs):
        return self.client_solutions.get(uuid=kwargs.get("uuid"))

    @permission_required(UserPermissionsEnum.HAS_CLIENT_INVOICE_ACCESS.value)
    def resolve_invoice(self, info, **kwargs):
        return get_client_invoice(self, **kwargs)

    def resolve_softwares(self, info, **kwargs):
        return self.softwares.all()


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

    @field_permission_required(UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS.value)
    def resolve_role(self, info, **kwargs):
        return self.role

    @field_permission_required(UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS.value)
    def resolve_spv_username(self, info, **kwargs):
        return self.spv_username

    @field_permission_required(UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS.value)
    def resolve_spv_password(self, info, **kwargs):
        return self.spv_password

    @field_permission_required(UserPermissionsEnum.HAS_CLIENT_INFORMATION_ACCESS.value)
    def resolve_ownership_percentage(self, info, **kwargs):
        return self.ownership_percentage


class ClientGroupType(DjangoObjectType):
    class Meta:
        model = ClientGroup
        only_fields = (
            "uuid",
            "name",
            "clients",
        )

    clients = graphene.NonNull(graphene.List(graphene.NonNull(ClientType)))

    def resolve_clients(self, info, **kwargs):
        return self.clients.all()


# INPUTS
class ClientActivityInput(graphene.InputObjectType):
    uuid = graphene.String()
    month = graphene.Int(required=True)
    year = graphene.Int(required=True)
    quantity = graphene.Int(required=True)


class ClientSolutionInput(graphene.InputObjectType):
    uuid = graphene.String()
    solution_uuid = graphene.String()
    unit_cost = graphene.Int()
    unit_cost_currency = CurrencyEnumType()
    quantity = graphene.Int()


class ClientSoftwareInput(graphene.InputObjectType):
    uuid = graphene.String()
    software = SoftwareEnumType(required=True)
    password = graphene.String()
    username = graphene.String()


class ClientInput(graphene.InputObjectType):
    uuid = graphene.String()
    name = graphene.String(required=True)
    description = graphene.String()
    program_manager_uuid = graphene.String()
    spv_username = graphene.String()
    spv_password = graphene.String()
    cui = graphene.String()
    client_solutions = graphene.List(ClientSolutionInput, required=True)
    softwares = graphene.List(graphene.NonNull(ClientSoftwareInput))


class ClientFileInput(graphene.InputObjectType):
    file = Upload(required=True)


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


class ClientGroupInput(graphene.InputObjectType):
    uuid = graphene.String()
    name = graphene.String(required=True)
    client_uuids = graphene.List(graphene.String, required=True)
