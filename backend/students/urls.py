from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import StudentViewSet

router = DefaultRouter()
router.register('', StudentViewSet, basename='student')

urlpatterns = [path('', include(router.urls))]
