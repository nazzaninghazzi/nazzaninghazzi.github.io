from rest_framework import serializers

from studios.models import Studio

class StudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studio
        fields = ('id', 'name', 'address', 'geo_lat', 'geo_long', 'postal_code', 'phone_number')
