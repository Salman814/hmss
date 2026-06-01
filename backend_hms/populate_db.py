import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_backend.settings')
django.setup()

from accounts.models import User
from appointments.models import Ward, Appointment

def populate():
    print("Creating test data...")
    
    # Create Admin
    admin, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@hms.com', 'role': 'ADMIN', 'is_superuser': True, 'is_staff': True})
    if created:
        admin.set_password('admin123')
        admin.save()
        print("Created admin user")

    # Create Doctor
    doctor, created = User.objects.get_or_create(username='doctor1', defaults={'email': 'doctor1@hms.com', 'role': 'DOCTOR'})
    if created:
        doctor.set_password('doctor123')
        doctor.save()
        print("Created doctor user")

    # Create Patient
    patient, created = User.objects.get_or_create(username='patient1', defaults={'email': 'patient1@hms.com', 'role': 'PATIENT'})
    if created:
        patient.set_password('patient123')
        patient.save()
        print("Created patient user")

    # Create Ward
    ward, created = Ward.objects.get_or_create(name='General Ward A', defaults={'total_beds': 20, 'occupied_beds': 5})
    if created:
        print("Created ward")

    # Create Appointment
    appt, created = Appointment.objects.get_or_create(
        patient=patient,
        doctor=doctor,
        defaults={
            'time': datetime.now() + timedelta(days=1),
            'status': 'PENDING'
        }
    )
    if created:
        print("Created appointment")

    print("Database populated successfully!")

if __name__ == '__main__':
    populate()
