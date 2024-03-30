# -*- coding: utf-8 -*-
import graphene


class CountableConnectionBase(graphene.relay.Connection):
    class Meta:
        abstract = True

    total_count = graphene.Int(required=True)

    def resolve_total_count(self, info, **kwargs):
        return self.length


# Use a custom node for Relay connections to ensure that we always resolve
# UUID as our model uuid instead of the relay generated UUID.
class CustomNode(graphene.relay.Node):
    class Meta:
        name = "Node"

    @staticmethod
    def to_global_id(type, id):
        # returns a non-encoded ID
        return id
