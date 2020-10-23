
from rest_framework.viewsets import ModelViewSet
from .permissions import QuotePermissions

from api_v1.serializers import QuoteSerializer, CreateQuoteSerializer, UpdateQuoteSerializer
from webapp.models import Quote


class QuoteViewSet(ModelViewSet):
    permission_classes = [QuotePermissions]

    def get_queryset(self):
        if self.request.method == 'GET' and not self.request.user.has_perm('webapp.quote_view'):
            return Quote.get_moderated()
        return Quote.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateQuoteSerializer
        elif self.request.method == 'PUT':
            return UpdateQuoteSerializer
        else:
            return QuoteSerializer
