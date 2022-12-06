import datetime
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    email = models.EmailField(max_length=64, unique=True)
    username = models.CharField(max_length=128)
    about = models.TextField()
    birth_date = models.DateField(default=datetime.date.today)
    hometown = models.CharField(max_length=64)
    present_location = models.CharField(max_length=64)
    website = models.CharField(max_length=128, blank=True, default="Undefined")
    GENDER_TYPES = (("Male", "Male"), ("Female", "Female"), ("Other", "Other"))
    gender = models.CharField(max_length=64, choices=GENDER_TYPES)
    interests = models.CharField(max_length=128, blank=True, default="Undefined")
    avatar = models.ImageField(upload_to="users/%Y/%m/%d/", blank=True)
    is_moderator = models.BooleanField("Moderator", default=False)
    is_administrator = models.BooleanField("Administrator", default=False)
    is_banned = models.BooleanField("Banned", default=False)
    EMAIL_FIELD = "username"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.username}"


class Topic(models.Model):
    title = models.CharField(max_length=64)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Board(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    title = models.CharField(max_length=64)
    description = models.TextField()
    image = models.ImageField(upload_to="boards/%Y/%m/%d/", blank=True)

    def __str__(self):
        return f"{self.title} - {self.topic}"


class Thread(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=64)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    is_locked = models.BooleanField(default=False)
    is_sticky = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.board.title}"


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.TextField()

    def __str__(self):
        return (
            f"{self.author.username} - {self.thread.title} - {self.thread.board.title}"
        )
