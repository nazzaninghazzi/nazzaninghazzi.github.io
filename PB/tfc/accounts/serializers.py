from rest_framework import serializers
import re

from accounts.models import MyUser, Card, FuturePayment
from subscriptions.serializers import SubscriptionSerializer


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['number', 'cvv', 'expiration',
                  'postal_code']
        extra_kwargs = {'cvv': {'write_only': True, 'required': True},
                        'number': {'required': True}, 'expiration': {'required': True},
                        'postal_code': {'required': True}}

    def create(self, validated_data):

        already_existing_card = Card.objects.filter(number=validated_data['number'])
        if len(already_existing_card) != 0:
            Card.objects.filter(number=validated_data['number']).update(cvv=validated_data['cvv'],
                                            expiration=validated_data['expiration'],
                                            postal_code=validated_data['postal_code'])
            Card.objects.filter(number=validated_data['number'])[0].save()
            return Card.objects.filter(number=validated_data['number'])[0]
        else:
            return super().create(validated_data)


class MyUserSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer(required=False)
    card = CardSerializer(required=False)

    class Meta:
        model = MyUser
        fields = ['username', 'password', 'password2',
                  'first_name', 'last_name', 'email', 'avatar',
                  'phone_number', 'subscription', 'card']
        extra_kwargs = {'password': {'write_only': True},
                        'password2': {'write_only': True, 'required': True},
                        'first_name': {'required': True}, 'last_name': {'required': True},
                        'email': {'required': True}, 'phone_number': {'required': True},
                        'subscription': {'read_only': True},
                        'class': {'read_only': True}}

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("password should be at least 8 characters long")
        elif not re.match("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$", value):
            raise serializers.ValidationError("password should contain at least one small letter,"
                                              " one capital letter, one number, and"
                                              " one special character.")
        return value

    def validate_first_name(self, value):
        if value == '':
            raise serializers.ValidationError("This field may not be blank.")
        return value

    def validate_last_name(self, value):
        if value == '':
            raise serializers.ValidationError("This field may not be blank.")
        return value

    def validate_email(self, value):
        if value == '':
            raise serializers.ValidationError("This field may not be blank.")
        return value

    def validate_phone_number(self, value):
        valid_codes = ['226', '249', '289', '343', '365', '416', '437',
                       '519', '548', '613', '647', '705', '807', '905']
        if value == '':
            raise serializers.ValidationError("This field may not be blank.")
        elif value[0:3] not in valid_codes:
            raise serializers.ValidationError("Phone code is invalid.")
        elif not re.match("^[0-9]{10}$", value):
            raise serializers.ValidationError("Phone number should be 10 characters long and all digits.")
        return value

    def validate(self, data):

        if data.get('password') != data.get('password2'):
            raise serializers.ValidationError({"repeat_password": "passwords should match"})

        return data

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        if 'password' in validated_data:
            user.set_password(validated_data['password'])
        user.save()
        return user


class FuturePaymentSerializer(serializers.ModelSerializer):
    card = CardSerializer()

    class Meta:
        model = FuturePayment
        fields = ['card', 'payment_price', 'payment_date']
