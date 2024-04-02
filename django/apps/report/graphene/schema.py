# -*- coding: utf-8 -*-
import graphene

from report.graphene.mutations import GenerateReport


class Mutation(graphene.ObjectType):
    generate_report = GenerateReport.Field(
        description="Generate an excel report and get a download link"
    )
