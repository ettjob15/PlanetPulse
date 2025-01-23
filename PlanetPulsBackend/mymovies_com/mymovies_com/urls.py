from django.contrib import admin
from django.urls import path, include
from yamod.serializers import MyTokenObtainPairView
from rest_framework.routers import DefaultRouter

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from yamod.views import GenreViewSet, MovieViewSet, PersonViewSet, PolutionMapViewSet, Co2CalculatorViewSet, register, user_profile, change_password



router = DefaultRouter()
router.register(r'polutionmap',PolutionMapViewSet,basename='polutionmap')
router.register(r'co2calculator',Co2CalculatorViewSet,basename='co2calculator')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
    path('api/register/', register, name='register'),
    path('api/profile/', user_profile, name='user_profile'),
    path('api/change-password/', change_password, name='change_password'),
]

