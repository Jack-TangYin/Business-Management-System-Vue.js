"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/stable/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # URL pattern for the index page
    path('staff/', views.handle_staff, name='handle_staff'),
    path('task/', views.handle_task, name='handle_task'),
    path('assignment/', views.handle_assignment, name='assignment-list'),
    path('assignment/<int:id>/', views.handle_assignment, name='assignment-detail'),  # Allows specifying an ID for DELETE
]


