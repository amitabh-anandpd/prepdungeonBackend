from django.urls import path
from . import views

urlpatterns = [
    path('join-waitlist/', views.join_waitlist, name='join_waitlist'),
    path('features/', views.features, name='features'),
    path('faq/', views.faq, name='faq'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
]

