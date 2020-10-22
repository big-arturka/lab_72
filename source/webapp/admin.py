from django.contrib import admin

from webapp.models import Quote, Vote

admin.site.register(Quote)
admin.site.register(Vote)