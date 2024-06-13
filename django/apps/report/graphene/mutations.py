# -*- coding: utf-8 -*-
import graphene

from api.graphene.mutations import BaseMutation
from api.permission_decorators import permission_required
from report.services.generate_reports_service import generate_report
from user.decorators import logged_in_user_required
from user.models import User
from user.permissions import UserPermissionsEnum


class GenerateReport(BaseMutation):
    class Arguments:
        year = graphene.Int(required=True)
        month = graphene.Int(required=True)
        category_codes = graphene.List(graphene.NonNull(graphene.String), required=True)
        user_uuids = graphene.List(graphene.NonNull(graphene.String), required=True)
        solution_uuids = graphene.List(graphene.NonNull(graphene.String), required=True)
        activity_uuids = graphene.List(graphene.NonNull(graphene.String), required=True)
        cost_min = graphene.Int()
        cost_max = graphene.Int()

    download_url = graphene.String(required=True)

    @logged_in_user_required
    @permission_required(UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value)
    def mutate(self, user: User, **kwargs):
        user_report = generate_report(user, **kwargs)
        return {
            "download_url": user_report.url,
        }
