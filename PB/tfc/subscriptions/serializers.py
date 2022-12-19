from rest_framework import serializers

from subscriptions.models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'price', 'interval']
        extra_kwargs = {'price': {'required': True}, 'interval': {'required': True}}
