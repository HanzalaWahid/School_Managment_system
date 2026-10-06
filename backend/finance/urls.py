from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import FeeStructureViewSet, FinanceAuditViewSet, InvoiceViewSet, PaymentViewSet

router = DefaultRouter()
router.register('fees', FeeStructureViewSet, basename='fee-structure')
router.register('payments', PaymentViewSet, basename='payment')
router.register('audit', FinanceAuditViewSet, basename='finance-audit')
router.register('', InvoiceViewSet, basename='invoice')

urlpatterns = [path('', include(router.urls))]
