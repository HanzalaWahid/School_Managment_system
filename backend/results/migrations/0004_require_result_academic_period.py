import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_backfill_academic_periods'),
        ('results', '0003_add_academic_year_and_term_to_results'),
    ]

    operations = [
        migrations.AlterField(
            model_name='result',
            name='academic_year',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='results', to='accounts.academicyear'),
        ),
        migrations.AlterField(
            model_name='result',
            name='term',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='results', to='accounts.term'),
        ),
    ]