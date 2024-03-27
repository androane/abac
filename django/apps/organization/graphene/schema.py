# -*- coding: utf-8 -*-
import graphene

from organization.graphene.mutations import (
    CreateClientFiles,
    DeleteClient,
    DeleteClientActivity,
    DeleteClientFile,
    DeleteClientUser,
    DeleteOrganizationActivity,
    DeleteOrganizationSolution,
    ToggleClientActivity,
    ToggleUserClientPermission,
    ToggleUserPermission,
    UpdateClient,
    UpdateClientActivity,
    UpdateClientActivityLogs,
    UpdateClientInvoiceStatus,
    UpdateClientSolutionLogs,
    UpdateClientUser,
    UpdateOrganizationActivity,
    UpdateOrganizationSolution,
    UpdateUserClientPermissions,
)
from organization.graphene.mutations.client_mutations import (
    DeleteClientGroup,
    UpdateClientGroup,
)
from organization.graphene.types import ClientType, OrganizationType
from organization.services.client_service import get_client
from user.decorators import logged_in_user_required
from user.models import User


class Query(graphene.ObjectType):
    class Meta:
        abstract = True

    organization = graphene.Field(
        graphene.NonNull(OrganizationType),
        description="Get an Organization",
    )
    client = graphene.Field(
        graphene.NonNull(ClientType),
        description="Get a Client",
        uuid=graphene.String(required=True),
    )

    @logged_in_user_required
    def resolve_organization(info, user: User, **kwargs):
        return user.organization

    @logged_in_user_required
    def resolve_client(info, user: User, **kwargs):
        return get_client(user, **kwargs)


class Mutation(graphene.ObjectType):
    # Organization User
    toggle_user_permission = ToggleUserPermission.Field(
        description="Toggle a permission for a given User"
    )
    update_user_client_permissions = UpdateUserClientPermissions.Field(
        description="Update User access to a give Clients"
    )
    toggle_user_client_permissions = ToggleUserClientPermission.Field(
        description="Toggle User Client Permissions"
    )

    # Organization Activity
    update_organization_activity = UpdateOrganizationActivity.Field(
        description="Update or Create a New Activity"
    )
    delete_organization_activity = DeleteOrganizationActivity.Field(
        description="Delete an Organization Activity"
    )

    # Organization Solution
    update_organization_solution = UpdateOrganizationSolution.Field(
        description="Update or Create a New Solution"
    )
    delete_organization_solution = DeleteOrganizationSolution.Field(
        description="Delete an Organization Solution"
    )

    # Client
    update_client = UpdateClient.Field(description="Update or Create a New Client")
    delete_client = DeleteClient.Field(description="Delete a Client")

    # Client Group
    update_client_group = UpdateClientGroup.Field(
        description="Update or Create a New Client Group"
    )
    delete_client_group = DeleteClientGroup.Field(description="Delete a Client Group")

    # Client Invoice
    update_client_invoice_status = UpdateClientInvoiceStatus.Field(
        description="Update Client Invoice Status"
    )

    # Client Activity
    update_client_activity = UpdateClientActivity.Field(
        description="Update or Create a New Client Activity"
    )
    delete_client_activity = DeleteClientActivity.Field(
        description="Delete a Client Activity"
    )
    toggle_client_activity = ToggleClientActivity.Field(
        description="Toggle Client Activity Executed Status"
    )
    update_client_activity_logs = UpdateClientActivityLogs.Field(
        description="Update Client Activity Logs"
    )
    update_client_solution_logs = UpdateClientSolutionLogs.Field(
        description="Update Client Solution Logs"
    )

    # Client File
    create_client_files = CreateClientFiles.Field(description="Create new Client Files")
    delete_client_file = DeleteClientFile.Field(description="Delete a Client File")

    # Client User
    update_client_user = UpdateClientUser.Field(
        description="Update or Create a New Client User"
    )
    delete_client_user = DeleteClientUser.Field(description="Delete a Client User")
