import datetime
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views import View

from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import IntegrityError
from rest_framework.permissions import IsAuthenticated
from .serializers import MovieSerializer, GenreSerializer, PersonSerializer, PolutionMapSerializer, Co2CalculatorSerializer

from . import models

class GenreViewSet(viewsets.ModelViewSet):
    '''
    Simple API for genres
    '''

    queryset = models.Genre.objects.all()
    serializer_class = GenreSerializer

    permission_classes = [IsAuthenticated]

    def create(self, request):
        '''
        Create new genre
        '''
        if not(request.user.groups.filter(name="Content Administrators").exists()):
            return Response({"errors":["You are not allowed to create genres"]}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk):
        '''
        Retrieve genre with primary key pk
        '''
    
        # Retrieve the Genre instance based on the primary key from the URL
        instance = self.get_object()
        # Serialize the instance
        serializer = self.get_serializer(instance)
        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def update(self, request, pk):
        '''
        Update genre with primary key pk
        '''
        if not(request.user.groups.filter(name="Content Administrators").exists()):
            return Response({"errors":["You are not allowed to update genres"]}, status=status.HTTP_403_FORBIDDEN)        
        # Retrieve the instance using the ID from the URL
        instance = self.get_object()
        # Deserialize the data
        serializer = self.get_serializer(instance, data=request.data)
        # Validate the data
        serializer.is_valid(raise_exception=True)
        # Save the updated instance
        serializer.save()
        # Return a success response with the updated data
        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request):
        '''
        List all available genres
        '''
        # Get all Genre instances
        queryset = self.get_queryset()
        
        # Serialize the queryset (list of Genre instances)
        serializer = self.get_serializer(queryset, many=True)
        
        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request,pk):
        '''
        Delete genre with primary key pk
        '''
        instance = self.get_object() 
        if request.user.groups.filter(name="Content Administrators").exists():
            self.perform_destroy(instance)
        else:
            return Response({"errors":["You are not allowed to delete genres"]},
                             status=status.HTTP_403_FORBIDDEN)
        return Response(status=status.HTTP_204_NO_CONTENT)

class PersonViewSet(viewsets.ModelViewSet):

    queryset = models.Person.objects.all()
    serializer_class = PersonSerializer

    permission_classes = [IsAuthenticated]

    def list(self, request):
        '''
        List all persons
        '''
        queryset = self.get_queryset()
        if request.GET.get("search"):
            queryset = queryset.filter(name__icontains=request.GET.get("search"))
        
        # Serialize the queryset (list of Genre instances)
        serializer = self.get_serializer(queryset, many=True)
        
        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)    

    def create(self, request, *args, **kwargs):
        '''
        Create a new person
        '''
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #def destroy(self, request,pk):
    #    Uncomment, if you do not want to support the .destroy method
    #    Disallow destroy method
    #    return Response(status=405)    

    def destroy(self, request, pk):
        '''
        Delete person with primary key pk
        '''
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT) 
        except IntegrityError:
            return Response({"errors":["Person is still referenced by a movie. Delete the movie first."]},status=status.HTTP_409_CONFLICT)

class MovieViewSet(viewsets.ModelViewSet):
    '''
    Simple movie list API
    '''

    queryset = models.Movie.objects.filter(visible=True)
    serializer_class = MovieSerializer
    
    permission_classes = [IsAuthenticated]


    def create(self, request, *args, **kwargs):
        '''
        Create a new movie
        '''
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            if 'year' not in request.data:
                year = datetime.datetime.strptime(request.data['released'], '%Y-%m-%d').year
            else:
                year = request.data['year']
            serializer.save(year=year)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request,pk):
        '''
        Delete movie with primary key pk (do not really delete it, set it to invisible)
        '''
        # if request.user.is_authenticated:
        instance = self.get_object()
        instance.visible=False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
        # return Response({"error":"Requires authentication"},
        #                  status=status.HTTP_403_FORBIDDEN)

    def list(self,request,format=None):
        '''
        Return the movie list as expected by the jquery data table.
        '''
        movie_list={
            "draw" : request.GET.get("draw",1),
            "recordsTotal" : None,
            "recordsFiltered": None,
            "data" : []
        }
        # GET paramters - set reasonable defaults when not provided
        start = request.GET.get("start",0)
        limit = request.GET.get("limit",10)
        search_title = request.GET.get('title')
        search_value = request.GET.get("search[value]")
        search_order = request.GET.get("order[0][dir]","asc")  
        order_by = request.GET.get("order[0][column]","rank")
        # Build filtered movie list
        mv = models.Movie.objects.filter(visible=True)

        if not request.user.is_superuser:
            mv = mv.filter(black_and_white=True)
        # we only allow searches, if we have more than 3 characters:
        if search_value and len(search_value)>3:
            # we add a .distinct to the query - the many to many relations would produce
            # duplicate entries in our result set:
            mv = mv.filter(Q(genres__name__icontains=search_value) |
                           Q(director__name__icontains=search_value) |
                           Q(actors__name__icontains=search_value)).distinct()
        if search_title and len(search_title)>3:
            # we add a .distinct to the query - the many to many relations would produce
            # duplicate entries in our result set:
            mv = mv.filter(Q(title__icontains=search_title)).distinct()
        # do some mappings for ManyToManyField and Foreign Keys
        # if we do provide a field in the order_by clause, order_by defaults 
        # to the primary key for sorting
        if order_by == "director":
            order_by = "director__name"
        if order_by == "genre":
            order_by = "genres__name"
        if order_by == "actors":
            order_by = "actors__name"
        mv = mv.order_by(order_by if search_order == "asc" else f"-{order_by}")
        movie_list["recordsTotal"] = models.Movie.objects.count()
        movie_list["recordsFiltered"] = mv.count()
        # Limit results based on what is given in start and limit
        mv = mv[int(start):int(start)+int(limit)]
        # Check groups of user
        is_content_administrator = request.user.groups.filter(name="Content Administrators").exists()
        for movie in mv:
            # movie.revenue is a DecimalField that needs to be casted to a primitive data type
            # otherwise json.dumps will fail during serialization
            revenue = str(movie.revenue) if is_content_administrator else "-"
            movie_list["data"].append(
                self.get_movie_response(movie, is_content_administrator)
            )
        return Response(movie_list)
    
    def update(self, request, pk):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        if 'year' not in request.data:
                year = datetime.datetime.strptime(request.data['released'], '%Y-%m-%d').year
        else:
            year = request.data['year']
        serializer.save(year=year)
        is_content_administrator = request.user.groups.filter(name="Content Administrators").exists()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk):
        movie = get_object_or_404(models.Movie, pk=pk)
        is_content_administrator = request.user.groups.filter(name="Content Administrators").exists()
        return Response(self.get_movie_response(movie, is_content_administrator), status=200)
    

    def get_movie_response(self, movie, is_content_administrator):
        serialized_genres= GenreSerializer(movie.genres.all(), many=True)
        serialized_actors = PersonSerializer(movie.actors.all(), many=True)
        serializedDirector = PersonSerializer(movie.director)
        revenue = str(movie.revenue) if is_content_administrator else "-"
        return {"id": movie.pk,
            "rank":movie.rank,
                "title": movie.title,
                "genres" : serialized_genres.data,
                "actors" : serialized_actors.data,
                "year" : movie.year,
                "released" : movie.released,
                "description" : movie.description,
                "director" : serializedDirector.data,
                "run_time" : movie.run_time,
                "rating" : str(movie.rating),
                "revenue" : revenue,
                "black_and_white": movie.black_and_white
                }
    
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
        queryset = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class Co2CalculatorViewSet(viewsets.ModelViewSet):
    queryset = models.Co2CalculatorHistory.objects.all()
    serializer_class = Co2CalculatorSerializer

    # permission_classes = [IsAuthenticated]
    def list(self, request):
        queryset = self.get_queryset()#.filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)