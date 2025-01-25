from rest_framework import serializers
from . import models
from .models import Co2CalculatorHistory, DistanceMode, UserProfile
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

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_picture', 'profile_picture_url']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()

        profile.profile_picture_url = profile_data.get('profile_picture_url', profile.profile_picture_url)
        profile.save()

        return instance
    

