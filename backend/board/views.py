import django_filters
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from knox.models import AuthToken
from .models import User, Board, Thread, Post
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
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
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
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


class BoardView(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Board.objects.all()

    def create(self, request):
        post_data = request.data.dict()
        serializer = self.get_serializer(data=post_data)
        if request.user.is_administrator == False:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.is_administrator == False:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ThreadView(viewsets.ModelViewSet):
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Thread.objects.all().order_by("-is_sticky", "-created_at")
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
    ]
    ordering = ["-is_sticky", "created_at"]


class PostView(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Post.objects.all().order_by("-created_at")
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
    ]
    ordering = ["created_at"]
