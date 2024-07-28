from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import  InterestRequestSerializer
from .models import  *
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView

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
    
class AcceptRejectInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        interest_id = request.data.get('interest_id')
        action = request.data.get('action')  # 'accept' or 'reject'
        try:
            interest_request = InterestRequest.objects.get(id=interest_id, receiver=request.user)
            if action == 'accept':
                interest_request.status = 'accepted'
                interest_request.save()

                # Create or get chat room
                chat_room, created = ChatRoom.objects.get_or_create(
                    name=f"chat_{interest_request.sender.id}_{interest_request.receiver.id}"
                )
                chat_room.users.add(interest_request.sender, interest_request.receiver)

                return Response({'message': 'Interest accepted', 'chat_room': chat_room.name}, status=status.HTTP_200_OK)
            elif action == 'reject':
                interest_request.status = 'rejected'
                interest_request.save()
                return Response({'message': 'Interest rejected'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        except InterestRequest.DoesNotExist:
            return Response({'error': 'Interest request not found'}, status=status.HTTP_404_NOT_FOUND)

class ChatRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        chat_rooms = request.user.chat_rooms.all()
        return Response({'chat_rooms': [room.name for room in chat_rooms]})