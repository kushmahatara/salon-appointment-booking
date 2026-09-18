from rest_framework import serializers
from .models import Service, Appointment

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'price', 'duration']

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Service name cannot be empty.")
        return value.strip()

    def validate_price(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("Price must be greater than 0 NPR.")
        return value

    def validate_duration(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("Duration must be greater than 0 minutes.")
        return value


class AppointmentReadSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 
            'customer_name', 
            'customer_phone', 
            'service', 
            'service_id', 
            'appointment_date', 
            'appointment_time', 
            'notes', 
            'status', 
            'created_at'
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service',
        write_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            'id', 
            'customer_name', 
            'customer_phone', 
            'service_id', 
            'appointment_date', 
            'appointment_time', 
            'notes', 
            'status', 
            'created_at'
        ]

    def validate_customer_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Customer name is required.")
        return value.strip()

    def validate_customer_phone(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Customer phone number is required.")
        return value.strip()
