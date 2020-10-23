from rest_framework import serializers
from rest_framework.serializers import CharField

from webapp.models import Quote


class QuoteSerializer(serializers.ModelSerializer):
    status_display = CharField(max_length=20, source='get_status_display', read_only=True)
    url = serializers.HyperlinkedIdentityField(read_only=True, view_name='api:quote-detail')

    class Meta:
        model = Quote
        fields = '__all__'
        read_only_fields = ['text', 'author', 'email', 'rating', 'status']


class CreateQuoteSerializer(QuoteSerializer):
    class Meta(QuoteSerializer.Meta):
        read_only_fields = ['rating', 'status']


class UpdateQuoteSerializer(QuoteSerializer):
    class Meta(QuoteSerializer.Meta):
        read_only_fields = ['author', 'email', 'rating']
