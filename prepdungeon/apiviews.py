from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.serializers.json import DjangoJSONEncoder
import json
from django.contrib.auth.hashers import make_password
from datetime import date
import os
import requests
import csv
import io
from PyPDF2 import PdfReader
import docx

from .forms import IndexForm, LoginForm, SignupForm
from .models import Question, User

EXPECTED_TOKEN = "831434743"

@csrf_exempt
def signup_api(request):
    if request.method == "POST":
        app_token = request.headers.get("x-prepdungeon-api")

        if app_token != EXPECTED_TOKEN:
            return JsonResponse({"success": False, "message": "Unauthorized request"}, status=403)
        try:
            data = json.loads(request.body)
            first_name = data.get("first_name")
            last_name = data.get("last_name")
            password = data.get("password")
            email = data.get("email")

            # Basic validation
            if not all([password, email, first_name, last_name is not None]):
                return JsonResponse({"success": False, "message": "Missing required fields"}, status=400)

            if User.objects.filter(username=email).exists():
                return JsonResponse({"success": False, "message": "Username already taken"}, status=400)

            user = User(
                username=email,
                email=email,
                first_name=first_name,
                last_name=last_name,
            )
            user.set_password(password)
            user.save()
            return JsonResponse({"success": True, "user_id": user.id}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)

    return JsonResponse({"success": False, "message": "POST request required"}, status=405)

@csrf_exempt
def login_api(request):
    if request.method == "POST":
        app_token = request.headers.get("x-prepdungeon-api")

        if app_token != EXPECTED_TOKEN:
            return JsonResponse({"success": False, "message": "Unauthorized request"}, status=403)
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get("username")
            password = data.get("password")

            user = authenticate(request, username=username, password=password)
            if user is not None:
                return JsonResponse({
                    "success": True,
                    "user_id": user.id,
                    "profile": user.profile.to_dict(),
                    "message": "Login successful"
                }, status=200)
            else:
                return JsonResponse({
                    "success": False,
                    "message": "Invalid username or password"
                }, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)
    else:
        return JsonResponse({"success": False, "message": "POST request required"}, status=405)