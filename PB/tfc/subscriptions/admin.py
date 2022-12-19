from django.contrib import admin

# Register your models here.
from subscriptions.models import Subscription
admin.site.register(Subscription)
