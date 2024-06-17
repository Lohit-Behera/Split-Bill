from django.contrib import admin
from .models import Group, Person, Payment

# Register your models here.

admin.site.register(Group)
admin.site.register(Person)
admin.site.register(Payment)
