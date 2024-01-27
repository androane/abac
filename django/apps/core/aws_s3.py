# -*- coding: utf-8 -*-
from urllib.parse import urlparse
from urllib.request import urlopen

from boto3 import client, resource
from django.conf import settings


def _get_client():
    s3 = client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    return s3


def _get_resource():
    s3 = resource(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    return s3


def _get_bucket(bucket_name):
    s3 = _get_resource()

    return s3.Bucket(bucket_name)


def upload_to_s3_from_binary_data(
    bucket_name, key_name, data, content_type="binary/octet-stream"
):
    bucket = _get_bucket(bucket_name)
    bucket.put_object(Key=key_name, Body=data, ContentType=content_type)


def upload_to_s3_from_file(
    bucket_name, key_name, file_name, content_type="binary/octet-stream"
):
    data = open(file_name, "rb")

    bucket = _get_bucket(bucket_name)
    bucket.put_object(Key=key_name, Body=data, ContentType=content_type)


def upload_to_s3_from_url(
    bucket_name, key_name, url, content_type="binary/octet-stream"
):
    response = urlopen(url)

    bucket = _get_bucket(bucket_name)
    bucket.put_object(Key=key_name, Body=response.read(), ContentType=content_type)


def get_bucket_and_key_from_s3_url(url):
    o = urlparse(url)
    bucket_name = o.netloc.split(".")[0]
    key = o.path[1:]
    return bucket_name, key


def get_url_for_s3_file(bucket_name, key_name):
    return "https://{}.s3.amazonaws.com/{}".format(bucket_name, key_name)


def get_signed_url_for_s3_file(bucket_name, key_name):
    s3 = _get_client()

    url = s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": bucket_name,
            "Key": key_name,
        },
    )

    return url


def sign_s3_url(url):
    bucket_name, key = get_bucket_and_key_from_s3_url(url)
    return get_signed_url_for_s3_file(bucket_name, key)
