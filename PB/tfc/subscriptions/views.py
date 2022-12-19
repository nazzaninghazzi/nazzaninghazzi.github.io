from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from subscriptions.models import Subscription
from subscriptions.serializers import SubscriptionSerializer

from accounts.serializers import MyUserSerializer
from classes.models import Enrollment


class SubscriptionsView(ListAPIView):
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        print(Subscription.objects.all())
        return Subscription.objects.all()


class AddSubscription(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MyUserSerializer

    def get_object(self):
        if self.request.user.card is None:
            raise PermissionDenied('Please add a card before subscribing.')
        else:
            requested_subscription = get_object_or_404(Subscription,
                                                       pk=self.request.GET.get('subscription_id'))
            self.request.user.subscription = requested_subscription
            if self.request.user.due_date is None:
                self.request.user.due_date = timezone.now().date()

            self.request.user.save()
            return self.request.user


class DeleteSubscription(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MyUserSerializer

    def get_object(self):
        self.request.user.subscription = None
        self.request.user.due_date = None
        self.request.user.save()
        usersclasses = Enrollment.objects.filter(user=self.request.user)
        for usersclass in usersclasses:
            usersclass.delete()
        return self.request.user
