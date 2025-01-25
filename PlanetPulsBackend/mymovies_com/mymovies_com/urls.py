from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from yamod.serializers import MyTokenObtainPairView
from rest_framework.routers import DefaultRouter

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from yamod.views import (
    PolutionMapViewSet, 
    Co2CalculatorViewSet, 
    register, user_profile, 
    change_password,
    upload_profile_picture,
    delete_account,
)



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
    path('api/upload-profile-picture/', upload_profile_picture, name='upload_profile_picture'),
    path('api/delete-account/', delete_account, name='delete_account'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)