from rest_framework.routers import DefaultRouter
from .views import RegistroDiarioViewSet   # CORREGIDO

router = DefaultRouter()
router.include_format_suffixes = False

router.register(r'', RegistroDiarioViewSet, basename='registros')

urlpatterns = router.urls
