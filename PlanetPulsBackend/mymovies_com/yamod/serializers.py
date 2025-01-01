from rest_framework import serializers
from . import models
from .models import Co2CalculatorHistory, DistanceMode
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Genre
        fields = '__all__'
        read_only_fields = ['id']

class PersonSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Person
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.Movie
        fields = '__all__'  

class PolutionMapSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.PolutionUserHistory
        exclude = ['user']

class Co2CalculatorSerializer(serializers.ModelSerializer):
    distanceMode = serializers.PrimaryKeyRelatedField(queryset=DistanceMode.objects.all())

    class Meta:
        model = Co2CalculatorHistory
        exclude = ['user']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        print(user.get_all_permissions())
        token['permissions'] = dict.fromkeys(user.get_all_permissions())

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


