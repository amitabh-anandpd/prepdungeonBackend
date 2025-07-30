from django.urls import path
from .apiviews import login_api, signup_api

urlpatterns = [
    path('login/', login_api, name='login_api'),
    path('signup/', signup_api, name='signup_api'),
]
