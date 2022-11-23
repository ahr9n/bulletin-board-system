from django.urls import path, include
from rest_framework import routers
from board import views
from knox import views as knox_views

router = routers.DefaultRouter()
router.register(r"users", views.UserView, "users")
router.register(r"boards", views.BoardView, "boards")
router.register(r"threads", views.ThreadView, "threads")
router.register(r"posts", views.PostView, "posts")

urlpatterns = [
    path("api/", include(router.urls)),
    path("register/", views.RegisterAPI.as_view()),
    path("login/", views.LoginAPI.as_view()),
    path("logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
]
