# -*- coding: utf-8 -*-
import pendulum
from django.core.management.base import BaseCommand

from organization.models.organization import Organization
from organization.services.client.client_activity_service import get_client_solutions
from organization.services.client.client_recurrent_client_activity_service import (
    transfer_recurrent_client_activities,
)
from user.permissions import UserPermissionsEnum


class Command(BaseCommand):
    help = "Runs functions that should be run every month"

    def handle(self, *args, **options):
        now = pendulum.now()
        transfer_recurrent_client_activities(now.year, now.month)

        for org in Organization.objects.all():
            for user in org.users.filter(client__isnull=True).iterator():
                if user.has_perm(
                    f"user.{UserPermissionsEnum.HAS_ORGANIZATION_ADMIN.value}"
                ):
                    break
            else:
                raise Exception("No organization admin found")

            for client in org.clients.iterator():
                get_client_solutions(user, client, now.month, now.year)
