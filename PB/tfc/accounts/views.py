import datetime

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import MyUserSerializer, CardSerializer, FuturePaymentSerializer

from accounts.models import MyUser, Card, FuturePayment, PreviousPayment


class MyUserLoginView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MyUserSerializer

    def get_object(self):
        return self.request.user


class MyUserCreateView(CreateAPIView):
    serializer_class = MyUserSerializer


class MyUserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response('Logged out successfully', status=status.HTTP_200_OK)


class MyUserEditView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MyUserSerializer

    def get_object(self):
        requested_user = get_object_or_404(MyUser, username=self.kwargs['username'])

        if requested_user.username == self.request.user.username:
            return requested_user
        else:
            raise PermissionDenied()


class UpdateCard(RetrieveAPIView, CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CardSerializer

    def post(self, request, *args, **kwargs):

        if 'number' in request.data:
            requested_card = Card.objects.filter(number=request.data['number'], used=True)

            if len(requested_card) == 1 and (self.request.user.card is None
                                             or self.request.user.card.number != request.data[
                                                 'number']):
                raise PermissionDenied('Card already in use by another user')
            else:
                # create card and assign to user
                response = super().post(request, *args, **kwargs)
                if self.request.user.card is not None and self.request.user.card.number != \
                        response.data['number']:
                    current_card = Card.objects.filter(number=self.request.user.card.number)[0]
                    current_card.used = False
                    current_card.save()
                new_card = Card.objects.filter(number=response.data['number'])[0]
                new_card.used = True
                new_card.save()
                self.request.user.card = new_card
                self.request.user.save()
                return response
        else:
            return super().post(request, *args, **kwargs)


class PaymentFutureView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FuturePaymentSerializer

    def get_queryset(self):
        if self.request.user.subscription is None:
            return FuturePayment.objects.none()
        date, length, add_time = self.request.user.due_date, 0, 0

        if self.request.user.subscription.interval == 'month':
            # show the payment for the next 12 months, add 1 month
            length = 12
            add_time = datetime.timedelta(days=30)
        elif self.request.user.subscription.interval == 'year':
            # show the payment for the next 3 years, add 1 year
            length = 3
            add_time = datetime.timedelta(days=365)
        elif self.request.user.subscription.interval == 'week':
            # show the payment for the next 12 weeks, add 1 week
            length = 12
            add_time = datetime.timedelta(days=7)
        for _ in range(0, length):
            FuturePayment.objects.create(card=self.request.user.card,
                                         payment_price=self.request.user.subscription.price,
                                         payment_date=date)

            date += add_time
        return FuturePayment.objects.all()

    def get(self, request, *args, **kwargs):
            FuturePayment.objects.all().delete()
            return super().get(request, *args, **kwargs)


class PaymentHistoryView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FuturePaymentSerializer

    def get_queryset(self):

        return PreviousPayment.objects.filter(user=self.request.user)
