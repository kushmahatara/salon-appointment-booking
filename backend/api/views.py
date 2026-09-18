from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Service, Appointment
from .serializers import ServiceSerializer, AppointmentSerializer, AppointmentReadSerializer

# -------------------------------------------------------------------
# Service Endpoints (Function-Based Views)
# -------------------------------------------------------------------

@api_view(['GET', 'POST'])
def services_list_create(request):
    """
    GET  /api/services - List all services
    POST /api/services - Create a new service
    """
    if request.method == 'GET':
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def service_detail(request, pk):
    """
    GET    /api/services/<id> - Retrieve single service
    PUT    /api/services/<id> - Update service
    DELETE /api/services/<id> - Delete service
    """
    service = get_object_or_404(Service, pk=pk)

    if request.method == 'GET':
        serializer = ServiceSerializer(service)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        service.delete()
        return Response({'message': 'Service deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# -------------------------------------------------------------------
# Appointment Endpoints (Function-Based Views)
# -------------------------------------------------------------------

@api_view(['GET', 'POST'])
def appointments_list_create(request):
    """
    GET  /api/appointments - List appointments (supports ?status=... query param)
    POST /api/appointments - Create appointment with double booking prevention
    """
    if request.method == 'GET':
        status_param = request.GET.get('status')
        if status_param and status_param != 'All':
            appointments = Appointment.objects.filter(status=status_param)
        else:
            appointments = Appointment.objects.all()
        serializer = AppointmentReadSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        service_id = request.data.get('service_id')
        appointment_date = request.data.get('appointment_date')
        appointment_time = request.data.get('appointment_time')

        # Double booking prevention check
        if service_id and appointment_date and appointment_time:
            conflict_exists = Appointment.objects.filter(
                service_id=service_id,
                appointment_date=appointment_date,
                appointment_time=appointment_time
            ).exclude(status='Cancelled').exists()

            if conflict_exists:
                return Response(
                    {"error": "This time slot is already booked for the selected service."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save()
            read_serializer = AppointmentReadSerializer(appointment)
            return Response(read_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def appointment_status_update(request, pk):
    """
    PATCH /api/appointments/<id>/status - Update appointment status
    """
    appointment = get_object_or_404(Appointment, pk=pk)
    new_status = request.data.get('status')

    valid_statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
    if not new_status or new_status not in valid_statuses:
        return Response(
            {"error": f"Invalid status. Choose from {valid_statuses}."},
            status=status.HTTP_400_BAD_REQUEST
        )

    appointment.status = new_status
    appointment.save()
    serializer = AppointmentReadSerializer(appointment)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'DELETE'])
def appointment_detail(request, pk):
    """
    GET    /api/appointments/<id> - Retrieve single appointment
    DELETE /api/appointments/<id> - Delete appointment
    """
    appointment = get_object_or_404(Appointment, pk=pk)

    if request.method == 'GET':
        serializer = AppointmentReadSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        appointment.delete()
        return Response({'message': 'Appointment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
