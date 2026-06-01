from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('DOCTOR', 'Doctor'),
        ('PATIENT', 'Patient'),
        ('WARD', 'Ward'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='PATIENT')
    phone_number = models.CharField(max_length=20, blank=True, default='')
    assigned_ward = models.ForeignKey(
        'appointments.Ward',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='patients'
    )
    bed_number = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.username} - {self.role}"
