import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_backfill_legacy_school_data'),
        ('courses', '0002_add_school_to_course'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='courses', to='accounts.school'),
        ),
    ]