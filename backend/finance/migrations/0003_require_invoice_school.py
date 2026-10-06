import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_backfill_legacy_school_data'),
        ('finance', '0002_add_school_and_academic_periods_to_invoices'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoices', to='accounts.school'),
        ),
    ]