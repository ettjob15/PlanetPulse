import datetime
from sqlite3 import IntegrityError
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views import View
from .models import DistanceMode, Co2CalculatorHistory

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import  PolutionMapSerializer, Co2CalculatorSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes, action
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password


from . import models


    
class PolutionMapViewSet(viewsets.ModelViewSet):
    queryset = models.PolutionUserHistory.objects.all()
    serializer_class = PolutionMapSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication is required to access this resource."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        polution_Index = request.GET.get('polutionIndex')
        if(polution_Index=='0' or polution_Index==''):
            queryset = self.get_queryset().filter(user=request.user)
        else:
            queryset = self.get_queryset().filter(user=request.user, polutionIndex=polution_Index)
        sortOptions = request.GET.get('sortOption')
        if(sortOptions!=''):
            match sortOptions:
                case 'date-asc':
                    queryset = queryset.order_by('dateValue')
                case 'date-desc':
                    queryset = queryset.order_by('-dateValue')
                case 'polIndex-asc':
                    queryset = queryset.order_by('polutionIndex')
                case 'polIndex-desc':
                    queryset = queryset.order_by('-polutionIndex')
                case 'City-asc':
                    queryset = queryset.order_by('city')
                case 'City-desc':
                    queryset = queryset.order_by('-city')
                case 'co-asc':
                    queryset = queryset.order_by('coValue')
                case 'co-desc':
                    queryset = queryset.order_by('-coValue')
                case 'no2-asc':
                    queryset = queryset.order_by('no2Value')
                case 'no2-desc':
                    queryset = queryset.order_by('-no2Value')
                case 'nh3-asc':
                    queryset = queryset.order_by('nh3Value')
                case 'nh3-desc':
                    queryset = queryset.order_by('-nh3Value')
                case 'o3-asc':
                    queryset = queryset.order_by('o3Value')
                case 'o3-desc':
                    queryset = queryset.order_by('-o3Value')
                case 'pm10-asc':
                    queryset = queryset.order_by('pm10Value')
                case 'pm10-desc':
                    queryset = queryset.order_by('-pm10Value')
                case 'pm25-asc':
                    queryset = queryset.order_by('pm25Value')
                case 'pm25-desc':
                    queryset = queryset.order_by('-pm25Value')
                case 'so2-asc':
                    queryset = queryset.order_by('so2Value')
                case 'so2-desc':
                    queryset = queryset.order_by('-so2Value')
                case _:
                    queryset = queryset.order_by('dateValue')
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication is required to access this resource."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT) 
        except IntegrityError:
            return Response({"errors":["Something is very very wrong!!!!!"]},status=status.HTTP_409_CONFLICT)
    
    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        queryset = self.get_queryset().filter(user=request.user)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class Co2CalculatorViewSet(viewsets.ModelViewSet):
    queryset = Co2CalculatorHistory.objects.all()
    serializer_class = Co2CalculatorSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request):
        if not request.user.is_authenticated:
            return Response(
               {"error": "Authentication is required to access this resource."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        queryset = self.get_queryset().filter(user=request.user)
        # Apply filters
        distance_mode = request.GET.get('distanceMode')
        if distance_mode:
            queryset = queryset.filter(distanceMode__name=distance_mode)

        # Apply sorting
        sort_by_distance = request.GET.get('sortByDistance')
        print(sort_by_distance)
        if sort_by_distance == 'distance-desc':
            queryset = queryset.order_by('-distance')
        elif sort_by_distance == 'distance-asc':
            queryset = queryset.order_by('distance')
        sort_by_co2 = request.GET.get('sortByCo2')
        if sort_by_co2 == 'co2-asc':
            queryset = queryset.order_by('co2')
        elif sort_by_co2 == 'co2-desc':
            queryset = queryset.order_by('-co2')

        sort_by_date = request.GET.get('sortByDate')
        if sort_by_date == 'date-asc':
            queryset = queryset.order_by('date')
        elif sort_by_date == 'date-desc':
            queryset = queryset.order_by('-date')
        
        search_term = request.GET.get('search')
        if search_term:
            queryset = queryset.filter(
                Q(fromCity__icontains=search_term) |
                Q(toCity__icontains=search_term) |
                Q(distanceMode__name__icontains=search_term) |
                Q(co2__icontains=search_term) |
                Q(date__icontains=search_term)
            )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    def create(self, request):
        data = request.data

        # Get the ID sent from the frontend
        distance_mode_id = data.get("distanceMode_id")

        if not distance_mode_id:
            return Response(
                {"error": "DistanceMode ID is missing from the request."},
                status=status.HTTP_400_BAD_REQUEST
            )

        print("Received Distance Mode ID:", distance_mode_id)  # Check if the ID is coming through

        try:
            # Look for the distance mode instance based on the ID
            distance_mode_instance = DistanceMode.objects.get(id=distance_mode_id)
            print("Found Distance Mode:", distance_mode_instance.name)  # Debugging output
        except DistanceMode.DoesNotExist:
            print(f"Error: DistanceMode with ID {distance_mode_id} not found.")
            return Response(
                {"error": f"DistanceMode with ID {distance_mode_id} not found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        emission_factors = {
            'Domestic_flight': 0.246,
            'Diesel_car': 0.171,
            'Petrol_car': 0.170,
            'Short_haul_flight': 0.151,
            'Long_haul_flight': 0.148,
            'Motorbike': 0.114,
            'Bus': 0.097,
            'Bus_city': 0.079,
            'Plug_in_hybrid': 0.068,
            'Electric_car': 0.047,
            'National_rail': 0.035,
            'Tram': 0.0029,
            'Underground': 0.028,
            'Ferry_foot_passenger': 0.0019,
            'e_bike': 0.003
        }

        mode_name = distance_mode_instance.name
        emission_factor = emission_factors.get(mode_name, 0)
        co2_emissions = data.get("distance", 0) * emission_factor 

        data["co2"] = co2_emissions
        data["distanceMode"] = distance_mode_instance  

        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user, distanceMode=distance_mode_instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    def destroy(self, request, pk):
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication is required to access this resource."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT) 
        except IntegrityError:
            return Response({"errors":["Something is very very wrong!!!!!"]},status=status.HTTP_409_CONFLICT)

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        queryset = self.get_queryset().filter(user=request.user)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    new_password = request.data.get('newPassword')

    if not new_password:
        return Response({"error": "New password is required"}, status=status.HTTP_400_BAD_REQUEST)

    user.password = make_password(new_password)
    user.save()

    return Response({"success": "Password changed successfully"}, status=status.HTTP_200_OK)