from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets
from .models import Paciente
from .serializers import PacienteSerializer
from rest_framework.permissions import IsAuthenticated

class PacientePagination(PageNumberPagination):
    page_size = 10  # número de pacientes por página
    page_size_query_param = 'page_size'  # opcional: permite cambiar el tamaño desde el query param
    max_page_size = 50  # límite superior opcional

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all().order_by('id')
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PacientePagination