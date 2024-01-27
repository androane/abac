# -*- coding: utf-8 -*-
from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class MediaFilesS3Boto3Storage(S3Boto3Storage):
    """
    Class is set in settings as value for DEFAULT_FILE_STORAGE
    Thus, media files know what storage to use
    """

    bucket_name = settings.MEDIA_BUCKET
