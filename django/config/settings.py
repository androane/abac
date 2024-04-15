# -*- coding: utf-8 -*-
import sys

import dj_database_url
import environ
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.graphene import GrapheneIntegration

root = environ.Path(__file__) - 2

apps_root = root.path("apps")
sys.path.insert(1, apps_root())

env = environ.Env(DEBUG=(bool, False))


SECRET_KEY = env.str("DJANGO_SECRET_KEY", "")

# Built-in in Digital Ocean App
DJANGO_HOST = env.str("APP_DOMAIN", "")
DJANGO_HOST_URL = env.str("APP_URL", "")

REACT_HOST = env.str("REACT_HOST", "")

DEBUG = env.bool("DEBUG", False)

ALLOWED_HOSTS = env.list(
    "APP_DOMAIN",
    cast=str,
    default=["localhost"],
) + ["dev-5nfx2.ondigitalocean.app"]

ADMINS = (("Andi", "mihai.zamfir90@proton.me"),)

INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third parties
    "corsheaders",
    "django_extensions",
    "graphene_django",
    "guardian",
    "safedelete",
    "simple_history",
    "storages",
    # Apps
    "api.apps.ApiConfig",
    "core.apps.CoreConfig",
    "organization.apps.OrganizationConfig",
    "report.apps.ReportConfig",
    "user.apps.UserConfig",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "api.middleware.JWTAuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "simple_history.middleware.HistoryRequestMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASE_URL = env.str("DATABASE_URL", "")

if not (len(sys.argv) > 1 and sys.argv[1] == "collectstatic"):
    DATABASES = {
        "default": dj_database_url.parse(DATABASE_URL),
    }


AUTH_USER_MODEL = "user.User"
# Silences the User model uniqueness check on email. We allow duplicate emails for deleted users.
# The latter one comes from django-guardian I think
SILENCED_SYSTEM_CHECKS = ["auth.E003", "auth.W004"]
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "guardian.backends.ObjectPermissionBackend",
)


LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


STATIC_URL = "/static/"
STATIC_ROOT = str(root.path("staticfiles"))


# AWS

MEDIA_BUCKET = "abac-media"
REGION = "fra1"
AWS_ACCESS_KEY_ID = env.str("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = env.str("AWS_SECRET_ACCESS_KEY", "")
AWS_S3_ENDPOINT_URL = f"https://{REGION}.digitaloceanspaces.com"

if DEBUG:
    MEDIA_URL = "/media/"
    MEDIA_ROOT = str(root.path("media"))
else:
    MEDIA_URL = f"https://{MEDIA_BUCKET}.{REGION}.digitaloceanspaces.com/"
    DEFAULT_FILE_STORAGE = "core.aws_s3_storages.MediaFilesS3Boto3Storage"
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    CSRF_TRUSTED_ORIGINS = [DJANGO_HOST_URL]

STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"
SHELL_PLUS = "ipython"


# django-cors-headers

CORS_ORIGIN_WHITELIST = [REACT_HOST]

# Sentry
SENTRY_DSN = env.str("SENTRY_DSN", "")
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[
            DjangoIntegration(transaction_style="function_name"),
            GrapheneIntegration(),
        ],
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production,
        traces_sample_rate=1.0,
        # If you wish to associate users to errors (assuming you are using
        # django.contrib.auth) you may enable sending PII data.
        send_default_pii=True,
        enable_tracing=True,
        with_locals=True,
    )

# django-graphene
GRAPHENE = {
    "ATOMIC_MUTATIONS": True,
    "MIDDLEWARE": ["api.middleware.SentryMiddleware"],
}

# django-guardian
GUARDIAN_MONKEY_PATCH = False

# Custom settings
DEFAULT_TIMEZONE = "Europe/Bucharest"

GRAPHQL_AUTH_SECRET = env.str("GRAPHQL_AUTH_SECRET", "")
GRAPHQL_DEBUG = env.bool("GRAPHQL_DEBUG", DEBUG)
