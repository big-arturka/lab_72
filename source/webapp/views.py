from django.shortcuts import render
from django.views import View
from django.views.generic import ListView
from webapp.models import Quote


class IndexView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'index.html')