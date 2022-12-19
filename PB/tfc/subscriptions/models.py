from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models


def validate_interval(value):
    if value.lower() == 'month' or value.lower() == 'year' or value.lower() == 'week':
        return value
    raise ValidationError("Interval has to be either week, month, or year")


class Subscription(models.Model):
    price = models.FloatField(validators=[MinValueValidator(0)], null=False, blank=False)
    interval = models.CharField(validators=[validate_interval],
                                max_length=10, help_text="interval should be either week, month, or year.")

    def __str__(self):
        return f'subscription {self.pk}'
