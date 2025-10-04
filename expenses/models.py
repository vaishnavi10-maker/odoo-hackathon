from django.db import models

CATEGORY_CHOICES = [
    ('travel', 'Travel'),
    ('meals', 'Meals & Entertainment'),
    ('equipment', 'Equipment'),
    ('software', 'Software'),
    ('office', 'Office Supplies'),
    ('other', 'Other'),
]

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
]

class Expense(models.Model):
    employee_id = models.CharField(max_length=100, db_index=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    receipt = models.FileField(upload_to='receipts/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee_id} - {self.category} - {self.amount}"
