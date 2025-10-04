from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Expense
from .serializers import ExpenseSerializer
from .authentication import SimpleTokenAuthentication
from rest_framework.permissions import BasePermission

# Custom permission: require that authentication returned a user (i.e. is_authenticated True)
class IsEmployeeAuthenticated(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        return bool(user and getattr(user, 'is_authenticated', False))

class ExpenseCreateView(APIView):
    authentication_classes = [SimpleTokenAuthentication]
    permission_classes = [IsEmployeeAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        # request.user.employee_id is set by the auth
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employee_id=request.user.employee_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyExpensesView(APIView):
    authentication_classes = [SimpleTokenAuthentication]
    permission_classes = [IsEmployeeAuthenticated]

    def get(self, request, *args, **kwargs):
        employee_id = request.user.employee_id
        qs = Expense.objects.filter(employee_id=employee_id).order_by('-created_at')
        serializer = ExpenseSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)
