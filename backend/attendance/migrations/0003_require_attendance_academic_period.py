import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_backfill_academic_periods'),
        ('attendance', '0002_add_academic_year_and_term'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendance',
            name='academic_year',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='attendance_records', to='accounts.academicyear'),
        ),
        migrations.AlterField(
            model_name='attendance',
            name='term',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='attendance_records', to='accounts.term'),
        ),
    ]