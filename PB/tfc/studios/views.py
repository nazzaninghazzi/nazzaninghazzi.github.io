from classes.models import Classes
from django.shortcuts import render
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from studios.models import Studio, StudioAmenities, StudioImages
from studios.serializers import StudioSerializer
from studios.validators import validate_lat_long
from rest_framework.exceptions import ValidationError

# Create your views here.
class StudioDetails(APIView):
    def get(self, request, studio_id):
        studio = Studio.objects.filter(id=studio_id)

        if not studio.exists():
            return Response('404 NOT FOUND', status=404)
        else:
            studio = studio.first()
            # get the studio's amenities
            amenities = StudioAmenities.objects.filter(studio=studio)
            amenitieslist = []
            for amenity in amenities:
                amenitieslist.append({ "type": amenity.type, "quantity": amenity.quantity})

            # get the studio's images
            images = StudioImages.objects.filter(studio=studio)
            imageslist = []
            for image in images:
                imageslist.append(image.image.url)
            
            return Response({
                'name': studio.name,
                'address': studio.address,
                'geo_loc': (studio.geo_lat, studio.geo_long),
                'postal_code': studio.postal_code,
                'phone_number': studio.phone_number,
                'amenities': amenitieslist,
                'images': imageslist
            })


class StudioSearch(ListAPIView):
    serializer_class = StudioSerializer
    def get_queryset(self):
        # get the lat and long params
        lat_long = self.request.GET.get('location', None)
        lat_long = lat_long.split(',') if lat_long else None
        # lat_long is [lat, long] or None

        # check if lat_long is valid
        if not lat_long or len(lat_long) < 2 or not validate_lat_long(float(lat_long[0]), float(lat_long[1])):

            raise ValidationError({"error": '400 BAD REQUEST, please include valid location in the string format location: "latitude,longitude"'})
        
        studioname = self.request.GET.get('studioname', None)
        amenities = self.request.GET.get('amenities', None)
        amenities = amenities.split(',') if amenities else None
        classes = self.request.GET.get('classes', None)
        classes = classes.split(',') if classes else None
        coach = self.request.GET.get('coach', None)
        coach = coach.split(',') if coach else None

        # get ids of studios that match the filter of amenities
        studio_ids_of_amenities = set()
        # filter by amenities
        if amenities:
            for amenity in amenities:
                ids = StudioAmenities.objects.filter(type=amenity).values_list('studio', flat=True)
                for studio_id in ids:
                    studio_ids_of_amenities.add(studio_id)

        # get ids of studios that match the filter of classes
        studio_ids_of_classes = set()
        # filter by classes
        if classes:
            for class_ in classes:
                ids = Classes.objects.filter(name=class_).values_list('studio', flat=True)
                for studio_id in ids:
                    studio_ids_of_classes.add(studio_id)
        
        # get ids of studios that match the filter of coach
        studio_ids_of_coach = set()
        # filter by coach
        if coach:
            for coach_ in coach:
                ids = Classes.objects.filter(coach=coach_).values_list('studio', flat=True)
                for studio_id in ids:
                    studio_ids_of_coach.add(studio_id)

        all_studio_ids = studio_ids_of_amenities.union(studio_ids_of_classes, studio_ids_of_coach)
        if amenities:
            all_studio_ids = all_studio_ids.intersection(studio_ids_of_amenities)
        if classes:
            all_studio_ids = all_studio_ids.intersection(studio_ids_of_classes)
        if coach:
            all_studio_ids = all_studio_ids.intersection(studio_ids_of_coach)

        # get all the studios
        studios = Studio.objects.all()

        include_studio = False
        if classes or amenities or coach:
            include_studio = True
        
        # 8 different permutations of filter params
        if not studioname and not include_studio:
            studios = Studio.objects.all().values_list('id', 'name', 'address', 'geo_lat', 'geo_long', 'postal_code', 'phone_number')
        elif not studioname and include_studio:
            studios = Studio.objects.filter(id__in=all_studio_ids).values_list('id', 'name', 'address', 'geo_lat', 'geo_long', 'postal_code', 'phone_number')
        elif studioname and not include_studio:
            studios = Studio.objects.filter(name__icontains=studioname).values_list('id', 'name', 'address', 'geo_lat', 'geo_long', 'postal_code', 'phone_number')
        else: # studioname and include_studio:
            studios = Studio.objects.filter(name__icontains=studioname, id__in=all_studio_ids).values_list('id', 'name', 'address', 'geo_lat', 'geo_long', 'postal_code', 'phone_number')

        # convert to list
        studios = list(studios)

        # sort by distance
        studios.sort(key=lambda studio: (studio[3] - float(lat_long[0]))**2 + (studio[4] - float(lat_long[1]))**2)
        
        # convert to json
        res = []
        for studio in studios:
            res.append({
                'id': studio[0],
                'name': studio[1],
                'address': studio[2],
                'geo_lat': studio[3],
                'geo_long': studio[4],
                'postal_code': studio[5],
                'phone_number': studio[6]
            })

        # return the studios
        return res