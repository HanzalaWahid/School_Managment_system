from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from attendance.models import Attendance
from courses.models import Course
from finance.models import Invoice
from results.models import Result
from students.models import Student
from teachers.models import Teacher
from accounts.models import AuditLog, CustomUser, School


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'super_admin':
            return Response({
                'total_schools': School.objects.count(),
                'active_schools': School.objects.filter(is_active=True).count(),
                'active_users': CustomUser.objects.filter(is_active=True).count(),
                'recent_audit_events': list(AuditLog.objects.order_by('-created_at')[:10].values(
                    'id', 'action', 'object_type', 'object_id', 'created_at', 'school__name'
                )),
            })
        if request.user.role == 'student':
            student_profile = Student.objects.filter(user=request.user).select_related('user').first()
            if student_profile is None:
                return Response({
                    'student_profile': 'Data unavailable',
                    'current_class': 'Data unavailable',
                    'current_section': 'Data unavailable',
                    'attendance_summary': 'Data unavailable',
                    'recent_results': 'Data unavailable',
                    'pending_fees': 'Data unavailable',
                    'upcoming_exams': 'Data unavailable',
                    'recent_announcements': 'Data unavailable',
                })

            attendance_rows = Attendance.objects.filter(student__user=request.user)
            attendance_summary = {
                'total': attendance_rows.count(),
                'present': attendance_rows.filter(status='present').count(),
                'absent': attendance_rows.filter(status='absent').count(),
                'late': attendance_rows.filter(status='late').count(),
            }
            recent_results = Result.objects.published().filter(student__user=request.user).order_by('-id')[:3]
            pending_fees = Invoice.objects.filter(student__user=request.user, status__in=['unpaid', 'pending']).count()

            return Response({
                'student_profile': {
                    'id': student_profile.id,
                    'username': student_profile.user.username,
                    'full_name': student_profile.user.get_full_name(),
                    'email': student_profile.user.email,
                },
                'current_class': student_profile.class_name,
                'current_section': student_profile.section,
                'attendance_summary': attendance_summary,
                'recent_results': list(recent_results.values('id', 'course__name', 'marks', 'grade')),
                'pending_fees': pending_fees,
                'upcoming_exams': 'Data unavailable',
                'recent_announcements': 'Data unavailable',
            })

        if request.user.role == 'parent':
            from accounts.models import Guardian
            guardian = Guardian.objects.filter(user=request.user, school=request.user.school).first()
            children = guardian.students.all() if guardian else Student.objects.none()
            selected_student = request.query_params.get('student')
            if selected_student:
                children = children.filter(pk=selected_student)
                if not children.exists():
                    from rest_framework.exceptions import NotFound
                    raise NotFound('This student is not linked to your guardian account.')
            return Response({
                'children': list(children.values('id', 'user__first_name', 'user__last_name', 'class_name', 'section')),
                'attendance_records': Attendance.objects.filter(student__in=children).count(),
                'published_results': Result.objects.published().filter(student__in=children).count(),
                'invoices': Invoice.objects.filter(student__in=children).count(),
            })

        if request.user.role == 'accountant':
            school = request.user.school
            invoices = Invoice.objects.filter(student__school=school)
            return Response({
                'school_name': getattr(school, 'name', 'School'),
                'total_invoices': invoices.count(),
                'outstanding_fees': invoices.filter(status__in=['unpaid', 'pending']).count(),
                'paid_invoices': invoices.filter(status='paid').count(),
                'overdue_invoices': invoices.filter(status='unpaid', due_date__lt=timezone.localdate()).count(),
                'recent_invoices': list(invoices.order_by('-created_at')[:5].values('id', 'student__user__first_name', 'student__user__last_name', 'amount', 'status', 'due_date')),
                'recent_payments': 'Data unavailable',
                'fee_collection_summary': {
                    'paid': invoices.filter(status='paid').count(),
                    'unpaid': invoices.filter(status='unpaid').count(),
                    'pending': invoices.filter(status='pending').count(),
                },
                'recent_announcements': 'Data unavailable',
            })

        if request.user.role in {'admin', 'school_admin', 'principal', 'receptionist'}:
            school = request.user.school
            students = Student.objects.filter(school=school)
            teachers = Teacher.objects.filter(school=school)
            courses = Course.objects.filter(school=school)
            attendance = Attendance.objects.filter(student__school=school)
            invoices = Invoice.objects.filter(student__school=school)
            results = Result.objects.filter(student__school=school)

            payload = {
                'total_students': students.count(),
                'total_teachers': teachers.count(),
                'total_courses': courses.count(),
                'attendance_summary': {
                    'total': attendance.count(),
                    'present': attendance.filter(status='present').count(),
                    'absent': attendance.filter(status='absent').count(),
                    'late': attendance.filter(status='late').count(),
                },
                'school_name': getattr(school, 'name', 'School'),
                'recent_announcements': 'Data unavailable',
            }

            if request.user.role not in {'receptionist', 'principal'}:
                payload.update({
                    'unpaid_invoices': invoices.filter(status='unpaid').count(),
                    'total_invoices': invoices.count(),
                    'pending_results': results.count(),
                })

            return Response(payload)

        if request.user.role == 'teacher':
            teacher_courses = Course.objects.filter(teacher__user=request.user)
            students = Student.objects.filter(attendance__course__teacher__user=request.user).distinct()
            today_attendance = Attendance.objects.filter(date=timezone.localdate(), course__teacher__user=request.user)
            absent_today = today_attendance.filter(status='absent').count()
            pending_results = Result.objects.filter(course__teacher__user=request.user).count()

            return Response({
                'assigned_classes': teacher_courses.count(),
                'assigned_subjects': teacher_courses.count(),
                'today_attendance': today_attendance.count(),
                'pending_attendance': absent_today,
                'students_requiring_attention': students.count(),
                'pending_marking_results': pending_results,
                'upcoming_exams': 'Data unavailable',
                'relevant_announcements': 'Data unavailable',
            })

        return Response({
            'total_students': Student.objects.count(),
            'total_teachers': Teacher.objects.count(),
            'total_courses': Course.objects.count(),
            'unpaid_invoices': Invoice.objects.filter(status='unpaid').count(),
            'total_invoices': Invoice.objects.count(),
        })
