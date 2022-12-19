from django.urls import path

from classes.views import ClassDetails, EnrollmentCreateView, EnrollmentDropView, \
    EnrollmentScheduleView, EnrollmentHistoryView, ClassSearch

app_name = 'classes'

urlpatterns = [
    path('studio/<int:studio_id>/details/', ClassDetails.as_view()),
    path('enroll/', EnrollmentCreateView.as_view()),
    path('drop/', EnrollmentDropView.as_view()),
    path('schedule/', EnrollmentScheduleView.as_view()),
    path('history/', EnrollmentHistoryView.as_view()),
    path('search/', ClassSearch.as_view())
]
