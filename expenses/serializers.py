from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'employee_id', 'amount', 'category', 'description', 'status', 'receipt', 'created_at']
        read_only_fields = ['id', 'status', 'created_at', 'employee_id']
