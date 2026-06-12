from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Result
from .serializers import ResultSerializer

class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.select_related('student__user', 'course').all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated]
