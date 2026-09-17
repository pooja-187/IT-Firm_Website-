from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from .views import (
    ProjectViewSet, ServiceViewSet, BlogViewSet, FAQViewSet,
    ClientViewSet, StatisticViewSet, AdminLoginView
)

class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)

class CategoriesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        categories = [
            {"id": 1, "name": "UI/UX Designing", "description": "User Interface & Experience", "status": "active", "createdAt": ""},
            {"id": 2, "name": "Web Development", "description": "Full Stack Web Apps", "status": "active", "createdAt": ""},
            {"id": 3, "name": "Mobile Apps", "description": "iOS & Android Development", "status": "active", "createdAt": ""},
            {"id": 4, "name": "Branding", "description": "Identity & Strategy", "status": "active", "createdAt": ""},
        ]
        return Response(categories, status=status.HTTP_200_OK)

router = DefaultRouter()
router.register('projects', ProjectViewSet, basename='project')
router.register('services', ServiceViewSet, basename='service')
router.register('blogs', BlogViewSet, basename='blog')
router.register('faq', FAQViewSet, basename='faq')
router.register('faqs', FAQViewSet, basename='faqs')
router.register('clients', ClientViewSet, basename='client')
router.register('partners', ClientViewSet, basename='partner')
router.register('statistics', StatisticViewSet, basename='statistic')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', AdminLoginView.as_view(), name='admin_login'),
    path('auth/token/', AdminLoginView.as_view(), name='admin_token'),
    path('auth/logout/', LogoutView.as_view(), name='admin_logout'),
    path('categories/', CategoriesView.as_view(), name='categories'),
]
