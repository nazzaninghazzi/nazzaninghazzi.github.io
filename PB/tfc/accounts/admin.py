from django.contrib import admin
from accounts.models import MyUser, Card, FuturePayment, PreviousPayment

admin.site.register(MyUser)
admin.site.register(Card)
admin.site.register(FuturePayment)
admin.site.register(PreviousPayment)
