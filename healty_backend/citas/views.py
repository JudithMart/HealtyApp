from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Cita
from .serializers import CitaSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated]
 
 #Filtros simples por paciente 
    def get_queryset(self):
     qs= super().get_queryset()
     paciente_id = self.request.query_params.get('paciente')
     if paciente_id:
           qs =qs.filter(paciente__id=paciente_id)
     return qs