from rest_framework import serializers
from . import models
from .models import Co2CalculatorHistory, DistanceMode
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from rest_framework import serializers


class DistanceModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistanceMode
        fields = ['id', 'name', ]


class Co2CalculatorSerializer(serializers.ModelSerializer):
    # Nested serializer for GET requests (serialization)
    distanceMode = DistanceModeSerializer(read_only=True)
    # Accepts an ID for POST requests (deserialization)
    distanceMode_id = serializers.PrimaryKeyRelatedField(
        queryset=DistanceMode.objects.all(), write_only=True, source='distanceMode'
    )

    class Meta:
        model = Co2CalculatorHistory
        fields = ['id', 'fromCity', 'toCity', 'distance', 'distanceMode', 'distanceMode_id', 'co2', 'date']

    def get_distanceMode(self, obj):
        return obj.distanceMode.friendly_name


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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user