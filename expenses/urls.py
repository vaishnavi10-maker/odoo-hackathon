from django.urls import path,include
from django.contrib import admin
from .views import ExpenseCreateView, MyExpensesView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('expenses/', ExpenseCreateView.as_view(), name='expense-create'),
    path('expenses/my/', MyExpensesView.as_view(), name='my-expenses'),
]
