import re
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import SET_NULL
from subscriptions.models import Subscription


def validate_card_number(value):
    errors = []
    if len(str(value)) != 16:
        errors.append("Card number has to be 16 characters long.")
    if not re.match("^[0-9]{16}$", value):
        errors.append("Card number has to be all digits")
    if errors:
        raise ValidationError(errors)
    return value


def validate_card_cvv(value):
    errors = []
    if len(str(value)) != 3 and len(str(value)) != 4:
        errors.append("Card cvv has to be 3 or 4 characters long.")
    if not re.match("^[0-9]{3}$", value) and not re.match("^[0-9]{4}$", value):
        errors.append("Card cvv has to be all digits")
    if errors:
        raise ValidationError(errors)
    return value


def validate_postal_code(value):
    if not re.match("^[A-Za-z][0-9][A-Za-z][ ]?[0-9][A-Za-z][0-9]$", value):
        raise ValidationError("Postal code is not in the correct format.")
    return value


def validate_expiration(value):
    if not re.match("^([0-9]){4}[-]([0-9]){2}$", value):
        raise ValidationError("Date has wrong format. Use this format instead: YYYY-MM.")
    return value


class Card(models.Model):
    number = models.CharField(validators=[validate_card_number],
                                 null=False, blank=False, max_length=16)
    cvv = models.CharField(validators=[validate_card_cvv], null=False, blank=False, max_length=4)
    expiration = models.CharField(null=False, blank=False, max_length=7,
                                  validators=[validate_expiration])
    postal_code = models.CharField(null=False, blank=False,
                                   validators=[validate_postal_code], max_length=7)
    used = models.BooleanField(default=True)

    def __str__(self):
        return f'card {self.pk}'


class MyUser(AbstractUser):
    password2 = models.CharField(max_length=150, blank=True, null=True)
    avatar = models.ImageField(upload_to='media/avatars', blank=True, null=True, default=None)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    subscription = models.ForeignKey(to=Subscription, on_delete=SET_NULL,
                                     related_name='subscription', null=True, blank=True)
    card = models.OneToOneField(to=Card, on_delete=SET_NULL,
                                related_name='card', null=True, blank=True)
    due_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.username


class FuturePayment(models.Model):
    card = models.ForeignKey(to=Card, on_delete=SET_NULL, related_name='payment_card',
                             blank=True, null=True)
    payment_price = models.FloatField(blank=True, null=True)
    payment_date = models.DateField(blank=True, null=True)


class PreviousPayment(models.Model):
    card = models.ForeignKey(to=Card, on_delete=SET_NULL, related_name='previous_payment_card',
                             blank=True, null=True)
    payment_price = models.FloatField(blank=True, null=True)
    payment_date = models.DateField(blank=True, null=True)
    user = models.CharField(max_length=150, null=True, blank=True)
