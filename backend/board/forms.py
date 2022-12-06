from django import forms
from .models import User
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


class MyUserCreationForm(UserCreationForm):
    def clean_username(self):
        username = self.cleaned_data["username"]
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError("Username already exists")

    class Meta(UserCreationForm.Meta):
        model = User


class MyUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
