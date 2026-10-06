from .models import AuditLog


def record_audit(actor, action, obj, details=None):
    school = getattr(obj, 'school', None)
    if school is None and hasattr(obj, 'student'):
        school = getattr(obj.student, 'school', None)
    if school is None and hasattr(obj, 'invoice'):
        school = getattr(obj.invoice, 'school', None)
    if school is None:
        school = getattr(actor, 'school', None)
    return AuditLog.objects.create(
        actor=actor if getattr(actor, 'is_authenticated', False) else None,
        school=school,
        action=action,
        object_type=obj.__class__.__name__,
        object_id=str(getattr(obj, 'pk', '')),
        details=details or {},
    )