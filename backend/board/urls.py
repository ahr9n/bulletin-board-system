from django.urls import path, include
from rest_framework import routers
from .views import *
from knox import views as knox_views

router = routers.DefaultRouter()
router.register(r"users", UserView, "users")
router.register(r"topics", TopicView, "topics")
router.register(r"boards", BoardView, "boards")
router.register(r"threads", ThreadView, "threads")
router.register(r"posts", PostView, "posts")

urlpatterns = [
    path("api/", include(router.urls)),
    path("register/", RegisterAPI.as_view()),
    path("login/", LoginAPI.as_view()),
    path("logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
]
