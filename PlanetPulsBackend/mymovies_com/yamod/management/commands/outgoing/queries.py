from yamod.models import *

# Count number of movies of the various genres created (e.g. Horror, Comedy) 
Movie.objects.filter(genres__name="Horror").count()
Movie.objects.filter(genres__name="Comedy").count()
# Case insensitve, same result as above
Movie.objects.filter(genres__name__iexact="comedy").count()

# Display all movie titles for a given director (e.g. tryp David Yates)
Movie.objects.filter(director__name="David Yates")
# Same result:
Movie.objects.filter(director__name__endswith="Yates")
# Same result, case insensitive:
Movie.objects.filter(director__name__iendswith="yates")
# Movies by Yates  between 2009 and 2010 
Movie.objects.filter(director__name="David Yates",year__gte=2009,year__lte=2010)
# Movies by Yates between 2009 and 2016, genre = Fantasy
Movie.objects.filter(director__name="David Yates",year__gte=2009,year__lte=2016,genres__name="Fantasy")

# Movies with Ben Anfleck 
from django.db.models import Q
# Movies Ben Affleck or Casey Affleck
Movie.objects.filter(Q(actors__name="Ben Affleck") | Q(actors__name="Casey Affleck"))
# Movies with Ben Affleck AND Henry Cavill
Movie.objects.filter(actors__name="Ben Affleck").filter(actors__name="Henry Cavill")


