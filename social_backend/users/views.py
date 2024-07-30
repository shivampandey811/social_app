from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer
from .models import User

@method_decorator(csrf_exempt, name='dispatch')
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            # ({'user': {'id': user.id, 'username': user.username}, 'sessionid': request.session.session_key})
            return Response({
                "message": "Logged in successfully",
                "users": serializer.data,
                'sessionid': request.session.session_key
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import generics, permissions

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]