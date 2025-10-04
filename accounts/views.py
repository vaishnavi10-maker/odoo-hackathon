from django.shortcuts import render
from .serializers import ExpenseRequestSerializer
# Create your views here.
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignUpSerializer, LoginSerializer
from .models import ExpenseRequest
# Signup API
@api_view(['POST'])
def signup(request):
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login API
@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        user_auth = authenticate(username=user.username, password=password)
        if user_auth:
            return Response({"message": "Login successful"})
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#manager views.py

# Fetch all requests
# Employee creates expense request
@api_view(['POST'])
def create_request(request):
    serializer = ExpenseRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Manager fetches all expense requests
@api_view(['GET'])
def list_requests(request):
    requests = ExpenseRequest.objects.all().order_by("-created_at")
    serializer = ExpenseRequestSerializer(requests, many=True)
    return Response(serializer.data)

# Manager approves/rejects a request
@api_view(['PATCH'])
def update_request(request, pk):
    try:
        exp_request = ExpenseRequest.objects.get(pk=pk)
    except ExpenseRequest.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ExpenseRequestSerializer(exp_request, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)