# -*- coding: utf-8 -*-
import sys
from socket import gethostbyname, gethostname

import dj_database_url
import environ

root = environ.Path(__file__) - 2

apps_root = root.path("apps")
sys.path.insert(1, apps_root())

env = environ.Env(DEBUG=(bool, False))


SECRET_KEY = env.str("DJANGO_SECRET_KEY", "")

# Built-in in Digital Ocean App
HOST = env.str("APP_DOMAIN", "")
APP_URL = env.str("APP_URL", "")

DEBUG = env.bool("DEBUG", False)
DEVELOPMENT_MODE = env.bool("DEVELOPMENT_MODE", False)

ALLOWED_HOSTS = env.list(
    "APP_DOMAIN",
    cast=str,
    default=[
        gethostname(),
        gethostbyname(gethostname()),
    ],
)


# Application definition

INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third parties
    "safedelete",
    "simple_history",
    # Apps
    "core.apps.CoreConfig",
    "users.apps.UsersConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
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
if DEVELOPMENT_MODE:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": root.path("db.sqlite3"),
        }
    }
elif len(sys.argv) > 0 and sys.argv[1] != "collectstatic":
    if not DATABASE_URL:
        raise Exception("DATABASE_URL environment variable not defined")
    print(DATABASE_URL)
    print(DATABASE_URL)
    print(DATABASE_URL)
    DATABASES = {
        "default": dj_database_url.parse(DATABASE_URL),
    }


AUTH_USER_MODEL = "users.User"
# Silences the User model uniqueness check on email. We allow duplicate emails for deleted users.
SILENCED_SYSTEM_CHECKS = ["auth.E003"]
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


LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


STATIC_URL = "/static/"
STATIC_ROOT = str(root.path("staticfiles"))

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"
