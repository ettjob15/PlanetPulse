# Generated by Django 5.1.2 on 2024-10-24 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yamod', '0004_alter_movie_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='revenue',
            field=models.DecimalField(decimal_places=2, max_digits=8, null=True),
        ),
    ]
