from django.contrib import admin

# Register your models here.
from .models import Studio, StudioImages, StudioAmenities

admin.site.register(Studio)
admin.site.register(StudioImages)
admin.site.register(StudioAmenities)
