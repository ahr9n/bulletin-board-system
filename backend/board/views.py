import django_filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import OrderingFilter
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser
from rest_framework.filters import OrderingFilter
from .serializers import (
    UserSerializer,
    BoardSerializer,
    ThreadSerializer,
    PostSerializer,
)
from .models import (
    User,
    Board,
    Thread,
    Post,
)

# Create your views here.

# User, Board, Thread, Post
class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = User.objects.all()


class BoardView(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser,)
    # TODO: sort ascendingly by posts in threads
    queryset = Board.objects.all()

    def create(self, request):
        post_data = request.data.dict()
        serializer = self.get_serializer(data=post_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ThreadView(viewsets.ModelViewSet):
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Thread.objects.all().order_by("-created_at")
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        OrderingFilter,
    ]
    ordering = ["created_at"]


class PostView(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Post.objects.all().order_by("-modified_at")
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        OrderingFilter,
    ]
    ordering = ["modified_at"]
