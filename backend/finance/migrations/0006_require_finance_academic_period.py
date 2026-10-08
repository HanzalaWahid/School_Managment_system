import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_backfill_academic_periods'),
        ('finance', '0005_feestructure_term_invoice_academic_year_invoice_term'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='academic_year',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='invoices', to='accounts.academicyear'),
        ),
        migrations.AlterField(
            model_name='invoice',
            name='term',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='invoices', to='accounts.term'),
        ),
        migrations.AlterField(
            model_name='feestructure',
            name='term',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='fee_structures', to='accounts.term'),
        ),
    ]