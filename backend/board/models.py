from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
def avatar_upload(instance, filename):
    imagename, extension = filename.split(".")
    return "users/%s.%s" % (instance.id, extension)


class User(AbstractUser):
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    email = models.EmailField(max_length=64, unique=True)
    username = models.CharField(max_length=128)
    about = models.TextField()
    birth_date = models.DateField()
    hometown = models.CharField(max_length=64)
    present_location = models.CharField(max_length=64)
    website = models.CharField(
        max_length=128, null=True, blank=True, default="Undefined"
    )
    GENDER_TYPES = (("Male", "Male"), ("Female", "Female"), ("Other", "Other"))
    gender = models.CharField(max_length=64, choices=GENDER_TYPES)
    interests = models.CharField(
        max_length=128, null=True, blank=True, default="Undefined"
    )
    avatar = models.ImageField(upload_to=avatar_upload)
    is_moderator = models.BooleanField("Moderator", default=False)
    is_administrator = models.BooleanField("Administrator", default=False)
    is_banned = models.BooleanField("Banned", default=False)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "username",
        "about",
        "birth_date",
        "hometown",
        "present_location",
    ]

    def __str__(self):
        return f"{self.username}"


def image_upload(instance, filename):
    imagename, extension = filename.split(".")
    return "boards/%s.%s" % (instance.id, extension)


class Board(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=64)
    topic = models.CharField(max_length=64)
    description = models.TextField()
    image = models.ImageField(upload_to=image_upload)

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
    modified_at = models.DateTimeField(auto_now=True)
    message = models.TextField()

    def __str__(self):
        return (
            f"{self.author.username} - {self.thread.title} - {self.thread.board.title}"
        )
