# Generated by Django 5.1.2 on 2024-10-24 15:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yamod', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='person',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='person',
            name='last_name',
        ),
        migrations.AddField(
            model_name='person',
            name='name',
            field=models.CharField(default='', max_length=70),
            preserve_default=False,
        ),
    ]
