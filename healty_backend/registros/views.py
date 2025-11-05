from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import RegistroDiario
from .serializers import RegistroDiarioSerializer

# Create your views here.


class RegistroDiarioPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class RegistroDiarioViewSet(viewsets.ModelViewSet):
    queryset = RegistroDiario.objects.all().order_by('-fecha')
    serializer_class = RegistroDiarioSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = RegistroDiarioPagination

    def get_queryset(self):
        qs = super().get_queryset()
        cita_id = self.request.query_params.get('cita')
        if cita_id:
            try:
                cid = int(cita_id)
                qs = qs.filter(cita__id=cid)
            except ValueError:
                pass
        return qs
