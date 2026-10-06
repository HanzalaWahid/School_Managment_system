from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import AcademicYear, Term


def resolve_school_period(school, academic_year=None, term=None, on_date=None):
    if school is None:
        raise ValidationError('A school is required to resolve an academic period.')

    year = academic_year or AcademicYear.objects.filter(school=school, is_active=True).first()
    if year is None or year.school_id != school.pk:
        raise ValidationError('Select an active academic year from your school.')

    target_date = on_date or timezone.localdate()
    selected_term = term or Term.objects.filter(
        academic_year=year,
        start_date__lte=target_date,
        end_date__gte=target_date,
    ).first()
    if selected_term is None:
        selected_term = Term.objects.filter(academic_year=year).order_by('start_date').first()
    if selected_term is None or selected_term.academic_year_id != year.pk:
        raise ValidationError('The academic year must have a term for this record.')

    return year, selected_term
