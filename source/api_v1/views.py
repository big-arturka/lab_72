from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .permissions import QuotePermissions

from api_v1.serializers import QuoteSerializer, CreateQuoteSerializer, UpdateQuoteSerializer
from webapp.models import Quote, Vote


class QuoteViewSet(ModelViewSet):
    permission_classes = [QuotePermissions]

    def get_queryset(self):
        if self.request.method == 'GET' and not self.request.user.has_perm('webapp.view_quote'):
            return Quote.get_moderated()
        return Quote.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateQuoteSerializer
        elif self.request.method == 'PUT':
            return UpdateQuoteSerializer
        else:
            return QuoteSerializer


class AddVote(APIView):
    def post(self, request, pk=None):
        quote = get_object_or_404(Quote, pk=pk)
        try:
            Vote.objects.get(session_key=self.request.session.session_key, quote_id=quote)
            return Response({'error': 'you already voted it'}, status=200)
        except:
            Vote.objects.create(session_key=self.request.session.session_key, quote=quote, rating=1)
            quote.rating += 1
            quote.save()
            return Response({'message': 'you left your vote'}, status=200)


class RemoveVote(APIView):
    def post(self, request, pk=None):
        quote = get_object_or_404(Quote, pk=pk)
        try:
            Vote.objects.get(session_key=self.request.session.session_key, quote_id=quote)
            return Response({'error': 'you already voted it'}, status=200)
        except Vote.DoesNotExist:
            Vote.objects.create(session_key=self.request.session.session_key, quote=quote, rating=-1)
            quote.rating -= 1
            quote.save()
            return Response({'message': 'you removed your voice'}, status=200)