# Generated by Django 5.1.2 on 2025-01-26 18:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yamod', '0018_userprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='img/'),
        ),
    ]
