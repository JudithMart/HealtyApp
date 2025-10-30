from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import Cita
from .serializers import CitaSerializer


class CitaPagination(PageNumberPagination):
      page_size = 10
      page_size_query_param = 'page_size'
      max_page_size = 50


class CitaViewSet(viewsets.ModelViewSet):
      queryset = Cita.objects.all()
      serializer_class = CitaSerializer
      permission_classes = [IsAuthenticated]
      pagination_class = CitaPagination

    
      def get_queryset(self):
            qs = super().get_queryset()
            paciente_id = self.request.query_params.get('paciente')
            if paciente_id:
                  try:
                        pid = int(paciente_id)
                        qs = qs.filter(paciente__id=pid)
                  except ValueError:
                       
                        pass
            return qs