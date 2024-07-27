from rest_framework import serializers
from .models import InterestRequest


class InterestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestRequest
        fields = ['id', 'sender', 'receiver', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

    def create(self, validated_data):
        interest_request = InterestRequest.objects.create(
            sender=validated_data['sender'],
            receiver=validated_data['receiver']
        )
        return interest_request
