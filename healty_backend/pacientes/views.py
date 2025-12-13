# pacientes/views.py
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets
from .models import Paciente
from .serializers import PacienteSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

class PacientePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all().order_by('id')
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PacientePagination
    
    def get_queryset(self):
        qs = super().get_queryset()
        
        # Filtro de búsqueda por nombre o apellido
        search = self.request.query_params.get('search', None)
        if search:
            qs = qs.filter(
                Q(nombre__icontains=search) | 
                Q(apellido__icontains=search)
            )
        
        # Filtro por género
        genero = self.request.query_params.get('genero', None)
        if genero:
            qs = qs.filter(genero=genero)
        
        return qs