import json

from django.http import HttpResponseNotAllowed, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet, ModelViewSet

from api_v1.serializers import QuoteSerializer, CreateQuoteSerializer, UpdateQuoteSerializer
from webapp.models import Quote


class QuoteViewSet(ModelViewSet):
    queryset = Quote.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateQuoteSerializer
        elif self.request.method == 'PUT':
            return UpdateQuoteSerializer
        else:
            return QuoteSerializer

#
# class OrderViewSet(ViewSet):
#     queryset = Order.objects.all()
#
#     def get_permissions(self):
#         if self.request.method == 'GET':
#             return [IsAdminUser()]
#         else:
#             return [AllowAny()]
#
#     def list(self, request):
#         objects = Order.objects.all()
#         slr = OrderSerializer(objects, many=True)
#         return Response(slr.data)
#
#     def create(self, request):
#         slr = OrderSerializer(data=request.data)
#         if slr.is_valid():
#             order = slr.save()
#             cart_ids = self.request.session.get('cart_ids', [])
#             for i in cart_ids:
#                 cart = get_object_or_404(Cart, pk=i)
#                 OrderProduct.objects.create(product_id=cart.product_id, order_id=order.pk, qty=cart.qty)
#                 cart.delete()
#             self.request.session.pop('cart_ids')
#             return Response(slr.data)
#         else:
#             return Response(slr.errors, status=400)
#
#     def retrieve(self, request, pk=None):
#         object = get_object_or_404(Order, pk=pk)
#         slr = OrderSerializer(object)
#         return Response(slr.data)
