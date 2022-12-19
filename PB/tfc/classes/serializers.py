from rest_framework import serializers

from classes.models import Classes, ClassInstance

class ClassInstanceSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField('get_name')
    description = serializers.SerializerMethodField('get_description')
    keywords = serializers.SerializerMethodField('get_keywords')
    coach = serializers.SerializerMethodField('get_coach')
    start_time = serializers.SerializerMethodField('get_start_time')
    capacity = serializers.SerializerMethodField('get_capacity')
    length = serializers.SerializerMethodField('get_length')

    def get_name(self, obj):
        return obj['name']
    
    def get_description(self, obj):
        return obj['description']

    def get_keywords(self, obj):
        return obj['keywords']
    
    def get_coach(self, obj):
        return obj['coach']
    
    def get_start_time(self, obj):
        return obj['start_time']
    
    def get_capacity(self, obj):
        return obj['capacity']
    
    def get_length(self, obj):
        return obj['length']

    class Meta:
        model = ClassInstance
        fields = ['id', 'name', 'description', 'keywords', 'coach', 'date', 'start_time', 'capacity', 'num_signed_up', 'length']

class ScheduleViewSerializer(serializers.ModelSerializer):
    class_instance_id = serializers.SerializerMethodField('get_class_instance_id')
    class_name = serializers.SerializerMethodField('get_class_name')
    studio_name = serializers.SerializerMethodField('get_studio_name')
    studio_id = serializers.SerializerMethodField('get_studio_id')
    date = serializers.SerializerMethodField('get_date')
    time = serializers.SerializerMethodField('get_time')
    alerts = serializers.SerializerMethodField('get_alerts')

    def get_class_instance_id(self, obj):
        return obj['class_instance_id']
    
    def get_class_name(self, obj):
        return obj['class_name']
    
    def get_studio_name(self, obj):
        return obj['studio_name']
    
    def get_studio_id(self, obj):
        return obj['studio_id']
    
    def get_date(self, obj):
        return obj['date']
    
    def get_time(self, obj):
        return obj['time']
    
    def get_alerts(self, obj):
        return obj['alerts']


    class Meta:
        model = ClassInstance
        fields = ['class_instance_id', 'class_name', 'studio_name', 'studio_id', 'date', 'time', 'alerts']


class ClassSearchSerializer(serializers.ModelSerializer):
    class_instance_id = serializers.SerializerMethodField('get_class_instance_id')
    class_name = serializers.SerializerMethodField('get_class_name')
    description = serializers.SerializerMethodField('get_description')
    date = serializers.SerializerMethodField('get_date')
    start_time = serializers.SerializerMethodField('get_start_time')
    end_time = serializers.SerializerMethodField('get_end_time')
    coach = serializers.SerializerMethodField('get_coach')
    free_spots = serializers.SerializerMethodField('get_free_spots')

    def get_class_instance_id(self, obj):
        return obj['class_instance_id']
    
    def get_class_name(self, obj):
        return obj['class_name']
    
    def get_description(self, obj):
        return obj['description']

    def get_date(self, obj):
        return obj['date']
    
    def get_start_time(self, obj):
        return obj['start_time']

    def get_end_time(self, obj):
        return obj['end_time']
    
    def get_coach(self, obj):
        return obj['coach']
    
    def get_free_spots(self, obj):
        return obj['free_spots']
    
    class Meta:
        model = ClassInstance
        fields = ['class_instance_id', 'class_name', 'description', 'date', 'start_time', 'end_time', 'coach', 'free_spots']
