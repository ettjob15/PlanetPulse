import csv
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
        # YOUR CODE ENDS HERE
        print(f'Successfully processed file: {filename}')
        

