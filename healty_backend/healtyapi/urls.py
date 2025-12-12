from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    
    path('admin/', admin.site.urls),

   
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('usuarios/', include('usuarios.urls')),
    path('pacientes/', include('pacientes.urls')),
    path('citas/', include('citas.urls')),
    path('registros/', include('registros.urls')),
    
]
