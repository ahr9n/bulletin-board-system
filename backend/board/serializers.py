from rest_framework import serializers
from .models import User, Board, Thread, Post

# User, Board, Thread, Post
class UserSerializer(serializers.ModelSerializer):
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


# TODO: threads_count, posts_count, validations
class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = "__all__"


# TODO:  last_reply_date, last_replier
class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"
