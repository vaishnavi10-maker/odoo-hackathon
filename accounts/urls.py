from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
     path("requests/", views.list_requests, name="list_requests"),
    path("requests/create/", views.create_request, name="create_request"),
    path("requests/<int:pk>/", views.update_request, name="update_request"),
]

