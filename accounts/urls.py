from django.urls import path
from . import views
from django.urls import path, include

urlpatterns = [
    path('auth/', views.auth, name='auth'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('onboarding/', views.onboarding, name='onboarding'),
    path('profile/', views.profile, name='profile'),
    path('logout/', views.logout_view, name='logout'),
    path('api/', include('accounts.apiurls'))
]