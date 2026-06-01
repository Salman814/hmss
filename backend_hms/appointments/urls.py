from django.urls import path
from .views import (
    AdminDashboardView, 
    DoctorDashboardView, 
    PatientDashboardView, 
    WardDashboardView,
    WardListCreateView,
    WardDetailView,
    AppointmentListCreateView,
    AppointmentDetailView
)

urlpatterns = [
    # Dashboards
    path('dashboard/admin/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('dashboard/doctor/', DoctorDashboardView.as_view(), name='doctor_dashboard'),
    path('dashboard/patient/', PatientDashboardView.as_view(), name='patient_dashboard'),
    path('dashboard/ward/', WardDashboardView.as_view(), name='ward_dashboard'),
    
    # Admin Management
    path('wards/', WardListCreateView.as_view(), name='ward_list_create'),
    path('wards/<int:pk>/', WardDetailView.as_view(), name='ward_detail'),
    path('appointments/', AppointmentListCreateView.as_view(), name='appointment_list_create'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment_detail'),
]
