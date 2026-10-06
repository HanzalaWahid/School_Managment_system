from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AuditLogViewSet, GuardianViewSet, RegisterView, LoginView, MeView, SchoolAcademicYearViewSet, SchoolTermViewSet, SchoolViewSet, UserDetailView, UserListView, ValidateTokenView

router = DefaultRouter()
router.register('schools', SchoolViewSet, basename='school')
router.register('academic-years', SchoolAcademicYearViewSet, basename='academic-year')
router.register('terms', SchoolTermViewSet, basename='term')
router.register('guardians', GuardianViewSet, basename='guardian')
router.register('audit-logs', AuditLogViewSet, basename='audit-log')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('validate/', ValidateTokenView.as_view(), name='validate-token'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('', include(router.urls)),
]
