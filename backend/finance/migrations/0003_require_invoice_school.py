import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_backfill_legacy_school'),
        ('finance', '0002_alter_invoice_options_invoice_school_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoices', to='accounts.school'),
        ),
    ]

