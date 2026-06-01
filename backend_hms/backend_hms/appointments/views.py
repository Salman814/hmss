from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from accounts.models import User
from .models import Appointment, Ward
from .serializers import AppointmentSerializer, WardSerializer

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ADMIN': return Response(status=403)
        return Response({
            'doctors': User.objects.filter(role='DOCTOR').count(),
            'patients': User.objects.filter(role='PATIENT').count(),
            'appointments': Appointment.objects.count(),
            'wards': Ward.objects.count()
        })

class DoctorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'DOCTOR': return Response(status=403)
        appointments = Appointment.objects.filter(doctor=request.user)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response({'appointments': serializer.data})

class PatientDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'PATIENT': return Response(status=403)
        appointments = Appointment.objects.filter(patient=request.user)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response({'appointments': serializer.data})

class WardDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['WARD', 'ADMIN']: return Response(status=403)
        wards = Ward.objects.all()
        serializer = WardSerializer(wards, many=True)
        return Response({
            'wards': serializer.data,
            'total_available_beds': sum([w.available_beds for w in wards]),
            'total_occupied_beds': sum([w.occupied_beds for w in wards])
        })

# --- Admin CRUD for Wards ---
class WardListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ADMIN': return Response(status=403)
        wards = Ward.objects.all()
        serializer = WardSerializer(wards, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'ADMIN': return Response(status=403)
        serializer = WardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WardDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        ward = get_object_or_404(Ward, pk=pk)
        
        if request.user.role == 'ADMIN':
            serializer = WardSerializer(ward, data=request.data, partial=True)
        elif request.user.role == 'WARD':
            # Ward managers can only update occupied_beds
            if 'occupied_beds' in request.data:
                ward.occupied_beds = request.data['occupied_beds']
                ward.save()
            serializer = WardSerializer(ward)
        else:
            return Response(status=403)
            
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if request.user.role != 'ADMIN': return Response(status=403)
        ward = get_object_or_404(Ward, pk=pk)
        ward.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# --- Admin CRUD for Appointments ---
class AppointmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ADMIN': return Response(status=403)
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'ADMIN': return Response(status=403)
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AppointmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        appointment = get_object_or_404(Appointment, pk=pk)
        
        if request.user.role == 'ADMIN':
            serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        elif request.user.role == 'DOCTOR':
            if appointment.doctor != request.user:
                return Response({'error': 'Not your appointment'}, status=403)
            # Doctors can only update status
            if 'status' in request.data:
                appointment.status = request.data['status']
                appointment.save()
            serializer = AppointmentSerializer(appointment)
        else:
            return Response(status=403)
            
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if request.user.role != 'ADMIN': return Response(status=403)
        appointment = get_object_or_404(Appointment, pk=pk)
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
