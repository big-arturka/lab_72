from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api_v1.views import QuoteViewSet, AddVote, RemoveVote

app_name = 'api'

router = DefaultRouter()
router.register(r'quotes', QuoteViewSet, basename='quote')

urlpatterns = [
    path('', include(router.urls)),
    path('quotes/<int:pk>/add', AddVote.as_view(), name='add'),
    path('quotes/<int:pk>/remove', RemoveVote.as_view(), name='remove')
]