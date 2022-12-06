from rest_framework import serializers
from .models import User, Topic, Board, Thread, Post
from django.contrib.auth import authenticate, password_validation


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "username",
            "password",
            "password2",
            "about",
            "birth_date",
            "hometown",
            "present_location",
        ]

    def validate_password1(self, data):
        result = password_validation.validate_password(data["password"])
        if data["password"] != data["password2"]:
            raise serializers.ValidationError("Password doesn't match")
        elif result is None:
            raise serializers.ValidationError("The password is not strong enough")
        else:
            return data

    def validate(self, data):
        self.validate_password1(data)
        return super().validate(data)

    def create(self, validated_data):
        user = User.objects.create_user(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
            about=validated_data["about"],
            birth_date=validated_data["birth_date"],
            hometown=validated_data["hometown"],
            present_location=validated_data["present_location"],
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Details!")


# User, Board, Thread, Post
class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return User(**validated_data)

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "username",
            "about",
            "birth_date",
            "hometown",
            "present_location",
            "website",
            "gender",
            "interests",
            "avatar",
            "is_moderator",
            "is_administrator",
            "is_banned",
        ]


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["id", "title", "author"]
        extra_kwargs = {"author": {"required": False}}

    def create(self, validated_data):
        topic = Topic.objects.create(
            author=self.context["request"].user,
            title=validated_data["title"],
        )
        return topic


class BoardSerializer(serializers.ModelSerializer):
    threads_count = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()

    def get_threads_count(self, obj):
        return obj.thread_set.count()

    def get_posts_count(self, obj):
        count = 0
        threads = obj.thread_set.all()
        for thread in threads:
            count += thread.post_set.count()
        return count

    class Meta:
        model = Board
        fields = "__all__"


class ThreadSerializer(serializers.ModelSerializer):
    last_reply_date = serializers.SerializerMethodField()
    last_reply_poster_name = serializers.SerializerMethodField()
    last_reply_poster_id = serializers.SerializerMethodField()

    def get_last_reply_date(self, obj):
        post = Post.objects.filter(thread__id=obj.id)
        if not len(post):
            return None
        post = post.latest("created_at")
        return post.created_at

    def get_last_reply_poster_id(self, obj):
        post = Post.objects.filter(thread__id=obj.id)
        if not len(post):
            return None
        post = post.latest("created_at")
        return post.author

    def get_last_reply_poster_name(self, obj):
        post = Post.objects.filter(thread__id=obj.id)
        if not len(post):
            return None
        post = post.latest("created_at")
        return post.author.username

    class Meta:
        model = Thread
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()

    def get_author_name(self, obj):
        serializer = UserSerializer(obj.author, many=False)
        return serializer.data["username"]

    def get_author_avatar(self, obj):
        serializer = UserSerializer(obj.author, many=False)
        return serializer.data["avatar"]

    class Meta:
        model = Post
        fields = "__all__"
