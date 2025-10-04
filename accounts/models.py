from django.db import models
from django.contrib.auth.models import User  # or your custom user

class ExpenseRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    # Associate request with employee who created it
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests')
    subject = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_finalized = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} by {self.employee.username}"
