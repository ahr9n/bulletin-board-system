import django_filters
from django.contrib.auth import login
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import OrderingFilter
from knox.models import AuthToken
from .models import User, Topic, Board, Thread, Post
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    TopicSerializer,
    BoardSerializer,
    ThreadSerializer,
    PostSerializer,
)

# Create your views here.
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


class LoginAPI(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


# User, Board, Thread, Post
class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = User.objects.all()
    pagination_class = None
    parser_classes = (MultiPartParser, FormParser)


class TopicView(viewsets.ModelViewSet):
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Topic.objects.all()
    pagination_class = None

    def create(self, request):
        post_data = request.data
        if request.user.is_administrator and not request.user.is_banned:
            serializer = self.get_serializer(data=post_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        else:
            raise PermissionDenied(
                {"error": "You are no authorized to create a topic!"}
            )

    def destroy(self, request, *args, **kwargs):
        if request.user.is_administrator and not request.user.is_banned:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                {"error": "You are not authorized to delete a topic!"}
            )


class BoardView(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Board.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = None

    def create(self, request):
        post_data = request.data.dict()
        serializer = self.get_serializer(data=post_data)
        if not request.user.is_administrator:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_administrator:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ThreadView(viewsets.ModelViewSet):
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Thread.objects.all()
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
    ]
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ("board__id",)

    def create(self, request):
        post_data = request.data.dict()
        serializer = self.get_serializer(data=post_data)
        if request.user.is_banned:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class PostView(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Post.objects.all().order_by("-created_at")
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        OrderingFilter,
    ]
    filterset_fields = (
        "thread__id",
        "author__id",
    )
    ordering = ["created_at"]

    def create(self, request):
        post_data = request.data.dict()
        serializer = self.get_serializer(data=post_data)
        if request.user.is_banned:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
