from django.urls import path
from . import views

urlpatterns = [
    path('daily-quest/', views.dailyQuest, name='daily-quest'),
]