import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_backfill_academic_periods'),
        ('courses', '0005_add_academic_year_and_term_to_courses'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='academic_year',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='courses', to='accounts.academicyear'),
        ),
        migrations.AlterField(
            model_name='courseenrollment',
            name='academic_year',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='course_enrollments', to='accounts.academicyear'),
        ),
        migrations.AlterField(
            model_name='courseenrollment',
            name='term',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='course_enrollments', to='accounts.term'),
        ),
    ]