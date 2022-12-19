import datetime

from django.core.management import BaseCommand
from django.utils import timezone

from accounts.models import MyUser, PreviousPayment


class Command(BaseCommand):
    help = 'Make payments that are due today'

    def handle(self, *args, **kwargs):
        all_users = MyUser.objects.all()
        for user in all_users:
            if user.subscription is not None:
                add_time = 0
                if user.subscription.interval == 'month':
                    add_time = datetime.timedelta(days=30)
                elif user.subscription.interval == 'year':
                    add_time = datetime.timedelta(days=365)
                elif user.subscription.interval == 'week':
                    add_time = datetime.timedelta(days=7)
                if timezone.now().date() == user.due_date:
                    PreviousPayment.objects.create(card=user.card,
                                                   payment_price=user.subscription.price,
                                                   payment_date=user.due_date, user=user)
                    user.due_date += add_time
                    user.save()
