from django.contrib import admin

from . import models

class MovieAdmin(admin.ModelAdmin):

    search_fields = ("title","genres__name")

    list_display = ("title","director","get_actors")

    def get_actors(self,instance):
        return ",".join([actor.name for actor in instance.actors.all()])
    get_actors.short_description = "Actors"

admin.site.register(models.Genre)
admin.site.register(models.Person)
admin.site.register(models.Movie,MovieAdmin)
