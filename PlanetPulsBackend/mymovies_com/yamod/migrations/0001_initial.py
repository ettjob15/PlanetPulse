# Generated by Django 5.1.2 on 2024-10-24 14:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=4096)),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rank', models.PositiveIntegerField()),
                ('title', models.CharField(max_length=4096)),
                ('description', models.TextField()),
                ('year', models.IntegerField()),
                ('run_time', models.PositiveIntegerField(help_text='in minutes')),
                ('rating', models.DecimalField(decimal_places=2, max_digits=2)),
                ('revenue', models.PositiveIntegerField(null=True)),
                ('genres', models.ManyToManyField(to='yamod.genre')),
                ('actors', models.ManyToManyField(related_name='actors', to='yamod.person')),
                ('director', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='director', to='yamod.person')),
            ],
        ),
    ]