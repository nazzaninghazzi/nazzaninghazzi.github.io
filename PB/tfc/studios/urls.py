from django.urls import path
from studios.views import StudioDetails, StudioSearch

app_name = 'studios'

urlpatterns = [
    path('<int:studio_id>/details/', StudioDetails.as_view(), name='studio_details'),
    path('search/', StudioSearch.as_view(), name='studio_search'),
]