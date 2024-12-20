from rest_framework import serializers
from . import models

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


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['permissions'] = dict.fromkeys(user.get_all_permissions())
        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer