import csv
import datetime
import os
from django.core.management.base import BaseCommand, CommandError

from yamod import models

class Command(BaseCommand):
    '''
    Imports IMDB CSV sample file. Existing rows will be updated.
    '''
    help = 'Imports IMDB CSV sample file. Existing rows will be updated.'

    def add_arguments(self, parser):
        parser.add_argument('filename', type=str, help='The name of the CSV file to process')

    def handle(self, *args, **options):
        filename = options['filename']
        
        # Check if the file exists
        if not os.path.isfile(filename):
            raise CommandError(f'The file "{filename}" does not exist.')

        # YOUR CODE STARTS HERE
        # read in CSV file and create
        # - genres
        # - actors
        # - director
        # - movies
        # Open the CSV file and read its contents
        with open(filename, mode='r', encoding='utf-8') as csv_file:
            csv_reader = csv.reader(csv_file)
            next(csv_reader, None)
            for row in csv_reader:
                rank,title,genre_names,description,director_name,actor_names,year,runtime,rating,_,revenue,_ = row
                actors=[]
                for actor_name in actor_names.split(","):
                    actor , _ = models.Person.objects.get_or_create(name=actor_name)
                    actors.append(actor)
                genres=[]
                for genre_name in genre_names.split(","):
                    genre , _ = models.Genre.objects.get_or_create(name=genre_name)
                    genres.append(genre)
                print("Processing %s" % row)
                director, _ = models.Person.objects.get_or_create(name=director_name)
                if not(revenue):
                    revenue = None
                movie, _ = models.Movie.objects.get_or_create(
                    rank=rank,
                    title=title.strip(),
                    description=description.strip(),
                    director=director,
                    year=year,
                    released=datetime.datetime(year, 1, 1),
                    run_time=runtime,
                    rating=rating,
                    revenue=revenue
                )
                for actor in actors:
                    movie.actors.add(actor)
                for genre in genres:
                    movie.genres.add(genre)
        # YOUR CODE ENDS HERE
        print(f'Successfully processed file: {filename}')
        

