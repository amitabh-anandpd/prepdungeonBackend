from django.shortcuts import render, redirect
from .forms import LoginForm, SignupForm
from .models import User, UserProfile
from tests.models import Question, UserAnswer, CompletedTest
from gamification.models import UserDailyQuest
from django.contrib.auth import authenticate, login
from django.conf import settings
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.serializers.json import DjangoJSONEncoder
from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils.html import escape
from django.utils import timezone
import json
from django.contrib.auth.hashers import make_password
from datetime import date
import requests
import csv
import io
from PyPDF2 import PdfReader
import docx
from dotenv import load_dotenv
import os
import threading
import markdown

# Create your views here.


def auth(request):
    if request.method == 'POST':
        if "login" in request.POST:
            login_form = LoginForm(request.POST)
            if login_form.is_valid():
                email = login_form.cleaned_data['email']
                password = login_form.cleaned_data['password']
                user = authenticate(request, username=email, password=password)
                if user is not None:
                    login(request, user)
                    return redirect('/dashboard')
                else:
                    request.session['notification'] = "Invalid email or password"
                    request.session['notification_type'] = "error"
        elif "signup" in request.POST:
            signup_form = SignupForm(request.POST)
            if signup_form.is_valid():
                user = signup_form.save(commit=False)
                user.set_password(signup_form.cleaned_data['password'])
                user.save()
                login(request, user)
                return redirect('/dashboard')
    login_form = LoginForm()
    signup_form = SignupForm()
    return render(
        request, 'auth.html', 
        {
            'signup_form': signup_form, 
            'login_form': login_form,
        })


def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        request.session["notification"] = "Logged out successfully!"
        request.session["notification_type"] = "success"
        return redirect("/auth")
    request.session['notification'] = "Couldn't Log out!"
    request.session['notification_type'] = "error"
    return redirect("/profile")



def dashboard(request):
    if not request.user.is_authenticated:
        return redirect('/')
    user = request.user
    all_quests = UserDailyQuest.objects.filter(user=user, date_created=timezone.now().date())
    completed_quests = all_quests.filter(is_completed=False)
    daily_quests = all_quests.filter(is_completed=True)
    level = user.profile.level
    xp_max = 50 * level * (1 + level)
    weak_topics = []
    return render(request,'dashboard.html',
        {
            'user': user,
            "daily_quests": daily_quests,
            "completed_quests": completed_quests,
            "xp_max": xp_max,
            "next_level": level+1,
            "weak_topics": weak_topics,
        })

def leaderboard(request):
    return render(request, 'leaderboard.html')

def onboarding(request):
    return render(request, 'onboarding.html')

def profile(request):
    if not request.user.is_authenticated:
        return redirect('/')
    user = request.user
    level = user.profile.level
    xp_max = 50 * level * (1 + level)
    return render(request,'profile.html',
        {
            'user': user,
            "xp_max": xp_max,
            "next_level": level+1,
        })