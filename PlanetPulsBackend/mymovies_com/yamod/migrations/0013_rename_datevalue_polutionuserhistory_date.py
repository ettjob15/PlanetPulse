# Generated by Django 5.1.2 on 2024-12-30 17:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('yamod', '0012_polutionuserhistory_datevalue'),
    ]

    operations = [
        migrations.RenameField(
            model_name='polutionuserhistory',
            old_name='dateValue',
            new_name='date',
        ),
    ]