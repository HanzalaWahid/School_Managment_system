from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from students.models import Student
from teachers.models import Teacher
from courses.models import Course
from finance.models import Invoice

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'total_students': Student.objects.count(),
            'total_teachers': Teacher.objects.count(),
            'total_courses': Course.objects.count(),
            'unpaid_invoices': Invoice.objects.filter(status='unpaid').count(),
            'total_invoices': Invoice.objects.count(),
        })
