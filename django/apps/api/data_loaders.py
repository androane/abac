# -*- coding: utf-8 -*-
"""
    Generic functions to create a data loader specific to a model for common techniques
        (resolivng a 1-to-1, resolving a M2M)

    Return builder functions so we can instantiate new data loaders for each request.
"""
from collections import defaultdict

from graphql_sync_dataloaders import SyncDataLoader
from promise import Promise
from promise.dataloader import DataLoader

from organization.models import Activity


def foreign_key_loader_builder(model):
    """
    Resolves foreign key relationships
    """

    def _builder():
        def batch_load_fn(keys):
            qs = model.objects.filter(id__in=keys)
            objects = {obj.id: obj for obj in qs}
            return [objects.get(obj_id, None) for obj_id in keys]

        return SyncDataLoader(batch_load_fn)

    return _builder


def children_loader_builder(model, field, select_related_fields=None):
    """
    Resolves M2M model relationships (e.g. apps each have many categories)
    When we resolve an instance of the parent model (app), the data loader bulk fetches
    the child model (category) based on the ids of the *parent* (app_ids).
    """

    def _builder():
        class Loader(DataLoader):
            def batch_load_fn(self, keys):
                d = defaultdict(list)
                filters = {field + "__in": keys}
                query = model.objects.filter(**filters)
                if select_related_fields:
                    query = query.select_related(*select_related_fields)
                for obj in query.iterator():
                    d[getattr(obj, field + "_id")].append(obj)
                result = [d.get(key, []) for key in keys]
                return Promise.resolve(result)

        return Loader()

    return _builder


LOADERS = {
    # # Children Key Loaders
    # app_categories_from_app = children_loader_builder(
    #     AppCategory, "app", select_related_fields=["category"]
    # )
    # Foreign Key Loaders
    "activity_from_client_activity": foreign_key_loader_builder(Activity),
}
