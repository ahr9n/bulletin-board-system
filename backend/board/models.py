from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class Place(models.Model):
    country = models.CharField(max_length=64, default="Egypt")
    city = models.CharField(max_length=64, default="Cairo")


class User(AbstractUser):
    name = models.CharField(max_length=64)
    email = models.EmailField(max_length=64, unique=True)
    about = models.TextField()
    birth_date = models.DateField()
    hometown = models.OneToOneField(Place, max_length=64)
    present_location = models.OneToOneField(Place, max_length=64)
    website = models.CharField(
        max_length=128, null=True, blank=True, default="undefined"
    )
    GENDER_TYPES = (
        ("Male", "Male"),
        ("Female", "Female"),
        ("Prefer not to say", "Prefer not to say"),
    )
    gender = models.CharField(max_length=64, choices=GENDER_TYPES)
    interests = models.CharField(
        max_length=128, null=True, blank=True, default="undefined"
    )
    avatar = models.ImageField(default=None)
    is_moderator = models.BooleanField("Moderator", default=False)
    is_administrator = models.BooleanField("Administrator", default=False)
    is_banned = models.BooleanField("Banned", default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "name",
        "email",
        "about",
        "birth_date",
        "hometown",
        "present_location",
    ]

    def __str__(self):
        return f"{self.username}"


class Topic(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.title}"


class Board(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=64)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    description = models.TextField()
    image = models.ImageField(default=None)

    def __str__(self):
        return f"{self.title} - {self.topic.title}"


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
    author_avatar = models.ImageField(default=None)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.TextField()

    def save(self, *args, **kwargs):
        self.board = self.thread.board
        super(Post, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.author.username} - {self.thread.title} - {self.board.title}"


class Reply(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    reply = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author.username} - {self.reply}"
