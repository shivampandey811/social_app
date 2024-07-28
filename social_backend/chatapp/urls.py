from django.urls import path
from .views import *

urlpatterns = [
    path('interest/', InterestRequestCreateView.as_view(), name='send_interest'),
    path('received_interests/', ReceivedInterestRequestsView.as_view(), name='received_interests'),
    path('interest/action/', AcceptRejectInterestView.as_view(), name='accept_reject_interest'),
    path('chat_rooms/', ChatRoomView.as_view(), name='chat_rooms'),
]
