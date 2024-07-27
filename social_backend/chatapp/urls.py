from django.urls import path
from .views import *

urlpatterns = [
    path('interest/', InterestRequestCreateView.as_view(), name='send_interest'),
    path('received_interests/', ReceivedInterestRequestsView.as_view(), name='received_interests'),

]
