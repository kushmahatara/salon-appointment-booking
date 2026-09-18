from django.db import models

class Service(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    duration = models.IntegerField(help_text="Duration in minutes")

    class Meta:
        db_table = 'services'
        ordering = ['id']

    def __str__(self):
        return f"{self.name} (NPR {self.price})"


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=50)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, db_column='service_id', related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    notes = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'appointments'
        ordering = ['-appointment_date', '-appointment_time']

    def __str__(self):
        return f"Appointment for {self.customer_name} - {self.service.name} on {self.appointment_date} at {self.appointment_time}"
