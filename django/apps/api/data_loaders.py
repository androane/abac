# -*- coding: utf-8 -*-
"""
    Generic functions to create a data loader specific to a model for common techniques
        (resolivng a 1-to-1, resolving a M2M)

    Return builder functions so we can instantiate new data loaders for each request.
"""
from collections import defaultdict

from graphql_sync_dataloaders import SyncDataLoader

from organization.models import Activity, ClientActivityLog
from organization.models.activity import Solution
from organization.models.client import Client, ClientSolutionLog
from organization.models.organization import Organization, OrganizationBusinessCategory
from user.models import User


def child_loader_builder(model, field, select_related_fields=None):
    def _builder():
        def batch_load_fn(keys):
            d = {}
            query = model.objects.filter(id__in=keys).select_related(field)
            if select_related_fields:
                query = query.select_related(*select_related_fields)
            for obj in query.iterator():
                d[obj.id] = getattr(obj, field)

            return [d.get(key, None) for key in keys]

        return SyncDataLoader(batch_load_fn)

    return _builder


def children_loader_builder(model, field, select_related_fields=None):
    """
    Resolves reverse FK
    """

    def _builder():
        def batch_load_fn(keys):
            d = defaultdict(list)
            filters = {field + "__in": keys}
            query = model.objects.filter(**filters)
            if select_related_fields:
                query = query.select_related(*select_related_fields)
            for obj in query.iterator():
                d[getattr(obj, field + "_id")].append(obj)

            return [d.get(key, []) for key in keys]

        return SyncDataLoader(batch_load_fn)

    return _builder


def foreign_key_loader_builder(model):
    """
    Resolves FK relationships
    """

    def _builder():
        def batch_load_fn(keys):
            qs = model.objects.filter(id__in=keys)
            objects = {obj.id: obj for obj in qs}
            return [objects.get(obj_id, None) for obj_id in keys]

        return SyncDataLoader(batch_load_fn)

    return _builder


def many_to_many_loader_builder(
    through_model, from_model, to_model, select_related_fields=None
):
    """
    Resolves M2M model relationships. Pass in the through model, and the direction of the relationship to resolve.

    Example: Resolve all departments for a service.
    """

    def _builder():
        def batch_load_fn(keys):
            d = defaultdict(list)
            filters = {from_model + "__in": keys}
            query = through_model.objects.filter(**filters).select_related(to_model)
            if select_related_fields:
                query = query.select_related(*select_related_fields)
            for obj in query.iterator():
                d[getattr(obj, from_model + "_id")].append(getattr(obj, to_model))
            return [d.get(key, []) for key in keys]

        return SyncDataLoader(batch_load_fn)

    return _builder


LOADERS = {
    # Child Loaders
    "client_profile_from_user": child_loader_builder(User, "client_profile"),
    # Children Loaders
    "logs_from_client_activity": children_loader_builder(
        ClientActivityLog, "client_activity"
    ),
    "logs_from_client_solution": children_loader_builder(
        ClientSolutionLog, "client_solution"
    ),
    "clients_from_client_group": children_loader_builder(Client, "group"),
    # Foreign Key Loaders
    "category_fk_loader": foreign_key_loader_builder(OrganizationBusinessCategory),
    "activity_fk_loader": foreign_key_loader_builder(Activity),
    "solution_fk_loader": foreign_key_loader_builder(Solution),
    "program_manager_fk_loader": foreign_key_loader_builder(User),
    # Many to Many Loaders
    # IMPORTANT: the order of the last 2 parameters is very important (i.e. from_model and to_model)
    "activities_from_solution": many_to_many_loader_builder(
        Solution.activities.through,
        "solution",
        "activity",
    ),
    "categories_from_organization": many_to_many_loader_builder(
        Organization.categories.through,
        "organization",
        "category",
    ),
}
