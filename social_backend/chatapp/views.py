from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import  InterestRequestSerializer
from .models import  InterestRequest
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class InterestRequestCreateView(generics.CreateAPIView):
    queryset = InterestRequest.objects.all()
    serializer_class = InterestRequestSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        data['sender'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
@method_decorator(csrf_exempt, name='dispatch')
class ReceivedInterestRequestsView(generics.ListAPIView):
    serializer_class = InterestRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InterestRequest.objects.filter(receiver=self.request.user, status='pending')