from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOnly(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')


class IsAdminOrStudentInvoicePermission(BasePermission):
    """Allow admins full access and students read-only access to their own invoices."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == 'admin':
            return True
        if request.user.role == 'student' and request.method in SAFE_METHODS:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        if request.user.role == 'student' and request.method in SAFE_METHODS:
            return obj.student.user == request.user
        return False


class IsAdminOrTeacherAttendancePermission(BasePermission):
    """Allow admins and teachers to manage attendance. Students can only view their own attendance."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role in ['admin', 'teacher']:
            return True
        if request.user.role == 'student' and request.method in SAFE_METHODS:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.role in ['admin', 'teacher']:
            return True
        if request.user.role == 'student' and request.method in SAFE_METHODS:
            return obj.student.user == request.user
        return False


class IsAdminOrTeacherReadOnly(BasePermission):
    """Allow admin full access; teachers can view teacher and student records read-only."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == 'admin':
            return True
        if request.user.role == 'teacher' and request.method in SAFE_METHODS:
            return True
        if request.user.role == 'student' and request.method in SAFE_METHODS:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        if request.user.role == 'teacher' and request.method in SAFE_METHODS:
            return True
        if request.user.role == 'student' and request.method in SAFE_METHODS:
            return getattr(obj, 'user', None) == request.user
        return False
