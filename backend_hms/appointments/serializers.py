from rest_framework import serializers
from .models import Appointment, Ward
from accounts.models import User
from accounts.serializers import UserSerializer

class WardSerializer(serializers.ModelSerializer):
    available_beds = serializers.IntegerField(read_only=True)

    class Meta:
        model = Ward
        fields = ('id', 'name', 'total_beds', 'occupied_beds', 'available_beds')

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    doctor_name = serializers.CharField(source='doctor.username', read_only=True)
    
    # We allow passing patient_id and doctor_id for creation
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='PATIENT'), 
        source='patient', 
        write_only=True
    )
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='DOCTOR'), 
        source='doctor', 
        write_only=True
    )

    class Meta:
        model = Appointment
        fields = ('id', 'patient', 'doctor', 'patient_id', 'doctor_id', 'patient_name', 'doctor_name', 'time', 'status')
        read_only_fields = ('patient', 'doctor')
