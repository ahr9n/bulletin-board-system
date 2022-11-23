from django.contrib import admin
from .models import *

admin.site.site_header = "Bulletin Board System"
admin.site.site_title = "Bulletin Board System"


# Register your models here.
admin.site.register(User)

# Board, Thread, Post
admin.site.register(Board)
admin.site.register(Thread)
admin.site.register(Post)
