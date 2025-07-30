"""
URL configuration for prepdungeon project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from .views import index, clear_notifications

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('clear-notification/', clear_notifications, name='clear_notifications'),
    path('auth/', include("accounts.urls")),
    path('', include('accounts.urls')), # Authentication, dashboard, profile
    path('', include('tests.urls')), # Tests, questions, study guide
    path('', include('gamification.urls')), # Daily quests
    path('', include('communication.urls')), # Contact, waitlist, info pages
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)