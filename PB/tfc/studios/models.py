from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import CASCADE


class Studio(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    geo_lat = models.FloatField(validators=[
        MinValueValidator(-90),
        MaxValueValidator(90)
    ])
    geo_long = models.FloatField(validators=[
        MinValueValidator(-180),
        MaxValueValidator(180)
    ])
    postal_code = models.CharField(max_length=6)
    phone_number = models.CharField(max_length=20)

    def __str__(self):
       return str(self.id) + ' ' + self.name
    

class StudioImages(models.Model):
    studio = models.ForeignKey(to=Studio, on_delete=CASCADE, related_name='+')
    image = models.ImageField(upload_to='media/studio_images')

    def __str__(self):
           return 'studio id' + str(self.studio.id) + ' studio name' + self.studio.name
    
class StudioAmenities(models.Model):
    studio = models.ForeignKey(to=Studio, on_delete=CASCADE, related_name='+')
    type = models.CharField(max_length=100)
    quantity = models.IntegerField(validators=[
        MinValueValidator(0)
    ])

    def __str__(self):
           return 'studio name' + self.studio.name + ' ' + self.type