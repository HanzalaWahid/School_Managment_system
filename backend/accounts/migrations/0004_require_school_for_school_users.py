from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_backfill_legacy_school_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='phone',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddConstraint(
            model_name='customuser',
            constraint=models.CheckConstraint(
                condition=(
                    models.Q(role='super_admin', school__isnull=True)
                    | (~models.Q(role='super_admin') & models.Q(school__isnull=False))
                ),
                name='user_school_required_except_super_admin',
            ),
        ),
    ]