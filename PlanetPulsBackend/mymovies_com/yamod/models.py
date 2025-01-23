import datetime
from django.db import models
from django.conf import settings



class PolutionUserHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pollution_histories'
    )
    dateValue = models.DateField(default=datetime.date.today)
    city = models.CharField(max_length=500)
    polutionIndex = models.IntegerField()
    coValue = models.DecimalField(max_digits=10,decimal_places=3)
    no2Value = models.DecimalField(max_digits=10,decimal_places=3)
    o3Value = models.DecimalField(max_digits=10, decimal_places=3)
    so2Value = models.DecimalField(max_digits=10, decimal_places=3)
    pm25Value = models.DecimalField(max_digits=10,decimal_places=3)
    pm10Value =models.DecimalField(max_digits=10, decimal_places=3)
    nh3Value = models.DecimalField(max_digits=10, decimal_places=3)


    def __str__(self):
        return f"{self.city} - {self.user.username}"

class DistanceMode(models.Model):
    name = models.CharField(max_length=4096)
    def __str__(self):
        return self.name

class Co2CalculatorHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='co2calc_histories'
    )
    fromCity = models.CharField(max_length=500)
    toCity = models.CharField(max_length=500)
    distance = models.DecimalField(max_digits=10,decimal_places=3)
    distanceMode = models.ForeignKey(DistanceMode,on_delete=models.PROTECT,related_name="mode")
    co2 = models.DecimalField(max_digits=10,decimal_places=3)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fromCity} - {self.toCity} - {self.user.username}  "