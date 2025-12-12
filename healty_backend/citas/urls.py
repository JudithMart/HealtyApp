from rest_framework.routers import DefaultRouter
from .views import CitaViewSet

router = DefaultRouter()
router.include_format_suffixes = False

router.register(r'', CitaViewSet, basename='citas')

urlpatterns = router.urls
