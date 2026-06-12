from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ResultViewSet

router = DefaultRouter()
router.register('', ResultViewSet, basename='result')

urlpatterns = [path('', include(router.urls))]
