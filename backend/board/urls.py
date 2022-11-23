from django.urls import path, include
from rest_framework import routers
from board import views

router = routers.DefaultRouter()
router.register(r"users", views.UserView, "users")
router.register(r"boards", views.BoardView, "boards")
router.register(r"threads", views.ThreadView, "threads")
router.register(r"posts", views.PostView, "posts")

urlpatterns = [
    path("api/", include(router.urls)),
]
