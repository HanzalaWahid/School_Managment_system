import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_backfill_legacy_school'),
        ('teachers', '0002_teacher_school'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teacher',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teachers', to='accounts.school'),
        ),
    ]

