from django.db import migrations


def assign_legacy_school(apps, schema_editor):
    School = apps.get_model('accounts', 'School')
    CustomUser = apps.get_model('accounts', 'CustomUser')
    Student = apps.get_model('students', 'Student')
    Teacher = apps.get_model('teachers', 'Teacher')
    Course = apps.get_model('courses', 'Course')
    Invoice = apps.get_model('finance', 'Invoice')

    needs_legacy_school = (
        CustomUser.objects.filter(school__isnull=True).exclude(role='super_admin').exists()
        or Student.objects.filter(school__isnull=True).exists()
        or Teacher.objects.filter(school__isnull=True).exists()
        or Course.objects.filter(school__isnull=True).exists()
        or Invoice.objects.filter(school__isnull=True).exists()
    )
    if not needs_legacy_school:
        return

    legacy_school, _ = School.objects.get_or_create(code='legacy', defaults={'name': 'Legacy School'})

    CustomUser.objects.filter(school__isnull=True).exclude(role='super_admin').update(school=legacy_school)

    for model in (Student, Teacher):
        for profile in model.objects.filter(school__isnull=True).select_related('user').iterator():
            school_id = profile.user.school_id
            if school_id is None:
                raise RuntimeError(f'Cannot migrate {model.__name__} {profile.pk}: linked user has no school.')
            model.objects.filter(pk=profile.pk).update(school_id=school_id)

    for course in Course.objects.filter(school__isnull=True).select_related('teacher').iterator():
        school_id = course.teacher.school_id if course.teacher_id else legacy_school.pk
        Course.objects.filter(pk=course.pk).update(school_id=school_id)

    for invoice in Invoice.objects.filter(school__isnull=True).select_related('student').iterator():
        school_id = invoice.student.school_id
        if school_id is None:
            raise RuntimeError(f'Cannot migrate invoice {invoice.pk}: linked student has no school.')
        Invoice.objects.filter(pk=invoice.pk).update(school_id=school_id)


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_add_school_and_role_to_custom_user'),
        ('students', '0002_add_school_to_student'),
        ('teachers', '0002_add_school_to_teacher'),
        ('courses', '0002_add_school_to_course'),
        ('finance', '0002_add_school_and_academic_periods_to_invoices'),
    ]

    operations = [
        migrations.RunPython(assign_legacy_school, migrations.RunPython.noop),
    ]