from django.urls import path
from . import views

urlpatterns = [
    # Service Endpoints
    path('services', views.services_list_create, name='services-list-create'),
    path('services/', views.services_list_create, name='services-list-create-slash'),
    path('services/<int:pk>', views.service_detail, name='service-detail'),
    path('services/<int:pk>/', views.service_detail, name='service-detail-slash'),

    # Appointment Endpoints
    path('appointments', views.appointments_list_create, name='appointments-list-create'),
    path('appointments/', views.appointments_list_create, name='appointments-list-create-slash'),
    path('appointments/<int:pk>/status', views.appointment_status_update, name='appointment-status-update'),
    path('appointments/<int:pk>/status/', views.appointment_status_update, name='appointment-status-update-slash'),
    path('appointments/<int:pk>', views.appointment_detail, name='appointment-detail'),
    path('appointments/<int:pk>/', views.appointment_detail, name='appointment-detail-slash'),
]
