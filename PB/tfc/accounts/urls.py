from django.urls import path

from accounts.views import MyUserCreateView, MyUserLoginView,\
    MyUserLogoutView, MyUserEditView, UpdateCard, PaymentFutureView, PaymentHistoryView

app_name = 'accounts'

urlpatterns = [
    path('register/', MyUserCreateView.as_view()),
    path('login/', MyUserLoginView.as_view()),
    path('logout/', MyUserLogoutView.as_view()),
    path('edit/<str:username>/', MyUserEditView.as_view()),
    path('update_card/', UpdateCard.as_view()),
    path('payment/history/', PaymentHistoryView.as_view()),
    path('payment/future/', PaymentFutureView.as_view()),
]
