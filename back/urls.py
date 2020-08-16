from django.urls import path
from . import views

# from rest_framework_jwt.views import obtain_jwt_token
from django_rest_passwordreset.views import (
    reset_password_request_token,
    reset_password_confirm,
    reset_password_validate_token,
)

urlpatterns = [
    path("token-auth/", views.ObtainFoxJWTToken.as_view()),
    path("current_user/", views.current_user),
    path("users/", views.UserList.as_view()),
    path("dashboard/", views.Dashboard.as_view()),
    path(
        r"validate_register_token/",
        reset_password_validate_token,
        name="reset-password-validate",
    ),
    path(
        r"password_reset_confirm/",
        reset_password_confirm,
        name="reset-password-confirm",
    ),
    path(
        r"password_reset/", reset_password_request_token, name="reset-password-request"
    ),
    path("projects/", views.ProjectList.as_view()),
    path("projects/<int:pk>/", views.ProjectDetail.as_view()),
]
