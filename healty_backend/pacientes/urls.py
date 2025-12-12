from rest_framework.routers import DefaultRouter
from .views import PacienteViewSet

router = DefaultRouter()
router.include_format_suffixes = False

router.register(r'', PacienteViewSet, basename='pacientes')

urlpatterns = router.urls
