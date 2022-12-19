from django.urls import path
from subscriptions.views import SubscriptionsView, AddSubscription, DeleteSubscription

app_name = 'subscriptions'

urlpatterns = [

    path('all/', SubscriptionsView.as_view()),
    path('subscribe/', AddSubscription.as_view()),
    path('unsubscribe/', DeleteSubscription.as_view())
]
