from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CourseEnrollmentViewSet, CourseViewSet

router = DefaultRouter()
router.register('enrollments', CourseEnrollmentViewSet, basename='course-enrollment')
router.register('', CourseViewSet, basename='course')

urlpatterns = [path('', include(router.urls))]
