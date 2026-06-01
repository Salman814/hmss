from django.db import models
from accounts.models import User

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    def __str__(self):
        return f"{self.patient.username} with {self.doctor.username} at {self.time}"

class Ward(models.Model):
    name = models.CharField(max_length=100)
    total_beds = models.IntegerField(default=0)
    occupied_beds = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    @property
    def available_beds(self):
        return self.total_beds - self.occupied_beds
