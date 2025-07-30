from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail
import json
import requests
import os
import threading
import markdown
from .models import Waitlist, ContactUsEmail
from .forms import ContactUsForm

from dotenv import load_dotenv
env_path = settings.BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(env_path)


API_URL = os.getenv("API_URL")


def join_waitlist(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST required"}, status=405)
    try:
        data  = json.loads(request.body.decode())
        name  = data.get("name", "").strip()
        email = data.get("email", "").strip()
        score = data.get("score") 
        if not name or not email:
            return JsonResponse({"success": False, "message": "Missing fields"}, status=400)
        threading.Thread(target=send_full_analysis, args=(score, email)).start()
        entry = Waitlist.objects.create(name=name, email=email)
        entry.set_score(score)
        return JsonResponse({"success": True})

    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)

def features(request):
    return render(request, 'features.html')

def faq(request):
    return render(request, 'faq.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    if request.method == 'POST':
        form = ContactUsForm(request.POST)
        if form.is_valid():
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            contact_us_instance = ContactUsEmail.objects.create(
                first_name=first_name, last_name=last_name, email=email, subject=subject,message=message
            )
            contact_us_instance.save()
            send_contact_email(contact_us_instance)
    form = ContactUsForm()
    return render(request, 'contact.html', {'form': form})


def send_full_analysis(result, email):
    prompt = "Score is as follows - \n" + json.dumps(result) + "\n\n Generate a detailed analysis, based on the score, as follows -\n\n"
    with open(os.getenv('ANALYSIS_PROMPT_FILE'), "r") as file:
        prompt = prompt + file.read()
    try:
        response = requests.post(
            API_URL + "/analysis",
            json={'prompt': prompt},
            timeout=60,
        )
        full_analysis = str(response.json()['response']).encode('utf-8').decode('unicode_escape')
        html_content = markdown.markdown(full_analysis)
        send_mail(
            subject="Full Analysis from PrepDungeon",
            message=full_analysis,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_content,
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send full analysis! ({e})")



def send_contact_email(contact_obj):
    subject = f"[Contact Us] {contact_obj.subject} from {contact_obj.email}"
    message = f"""
                Name: {contact_obj.first_name} {contact_obj.last_name}
                Email: {contact_obj.email}
                Subject: {contact_obj.subject}

                Message:
                {contact_obj.message}
                    """
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.SUPPORT_INBOX, os.getenv('JHA_EMAIL')],
        fail_silently=True,
    )
    greeting = f"Hi {contact_obj.first_name}," if contact_obj.first_name else "Hi,"
    message = f"""{greeting}

Thank you for taking the time to share your feedback with us. We've received your message and truly appreciate your input — it helps us improve and serve you better.

Our team is reviewing your feedback and will get back to you shortly if a response is needed.

In the meantime, feel free to reach out to us at {settings.DEFAULT_FROM_EMAIL} if you have any further thoughts or questions.

Warm regards,
Team PrepDungeon
"""
    send_mail(
        subject="Thank You for Your Feedback!",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[contact_obj.email],
        fail_silently=True,
    )