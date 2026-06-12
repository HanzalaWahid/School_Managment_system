from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/students/', include('students.urls')),
    path('api/teachers/', include('teachers.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/invoices/', include('finance.urls')),
    path('api/results/', include('results.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]
