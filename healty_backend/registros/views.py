from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import RegistroDiario
from .serializers import RegistroDiarioSerializer
# Create your views here.

class RegistroDiarioViewSet(viewsets.ModelViewSet):
    queryset = RegistroDiario.objects.all().order_by('-fecha')
    serializer_class = RegistroDiarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        cita_id = self.request.query_params.get('cita')
        if cita_id:
            qs = qs.filter(cita__id=cita_id)    
        return qs
