import datetime
from django.db import models

class Genre(models.Model):

    name = models.CharField(max_length=4096)

    def __str__(self):
        return self.name

class Person(models.Model):

    name = models.CharField(max_length=70)

    def __str__(self):
        return self.name

class Movie(models.Model):

    rank = models.PositiveIntegerField()
    title = models.CharField(max_length=4096)
    genres = models.ManyToManyField(Genre)
    actors = models.ManyToManyField(Person,related_name="actors")
    description = models.TextField()
    director = models.ForeignKey(Person,on_delete=models.PROTECT,related_name="director")
    year = models.IntegerField(null=True)
    released = models.DateField(default=datetime.date.today)
    run_time = models.PositiveIntegerField(help_text="in minutes")
    rating = models.DecimalField(max_digits=2,decimal_places=1)
    revenue = models.DecimalField(max_digits=8,decimal_places=2,null=True)
    visible = models.BooleanField(default=True)
    black_and_white = models.BooleanField(default=False)

    def __str__(self):
        return self.title

