from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from django.conf import settings

class EmployeeUser:
    def __init__(self, employee_id):
        self.employee_id = employee_id

    @property
    def is_authenticated(self):
        return True

class SimpleTokenAuthentication(BaseAuthentication):
    """
    Expects header:
      Authorization: Bearer <employeeId>:<SECRET>
    Example:
      Authorization: Bearer alice:supersecret123
    """
    def authenticate(self, request):
        auth = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if not auth:
            return None  # No header -> DRF will treat as unauthenticated (we'll signal error later)
        if not auth.startswith('Bearer '):
            raise exceptions.AuthenticationFailed('Invalid authorization header')
        token = auth.split(' ', 1)[1]
        if ':' not in token:
            raise exceptions.AuthenticationFailed('Token format must be employeeId:SECRET')
        employee_id, secret = token.split(':', 1)
        if secret != settings.EMPLOYEE_API_SECRET:
            raise exceptions.AuthenticationFailed('Invalid secret')
        user = EmployeeUser(employee_id)
        return (user, token)
