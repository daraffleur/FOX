from FOX.settings import *  # noqa F401, 403

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": "test_database",
    }
}
