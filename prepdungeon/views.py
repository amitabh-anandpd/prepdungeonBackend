from django.conf import settings
from django.shortcuts import render, redirect
from django.core.serializers.json import DjangoJSONEncoder
import json
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
import requests
import csv
import io
from PyPDF2 import PdfReader
import docx
from dotenv import load_dotenv
import os
from .forms import IndexForm
from tests.models import Question

env_path = settings.BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(env_path)


API_URL = os.getenv("API_URL")
def extract_text_from_file(uploaded_file):
    if uploaded_file.name.endswith('.pdf'):
        reader = PdfReader(uploaded_file)
        return "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
    
    elif uploaded_file.name.endswith(('.doc', '.docx')):
        doc = docx.Document(uploaded_file)
        return "\n".join([para.text for para in doc.paragraphs])
    
    elif uploaded_file.name.endswith('.txt'):
        uploaded_file.seek(0)
        return uploaded_file.read().decode('utf-8', errors='ignore')
    return ""


def save_questions_from_csv(csv_text, test_type):

    reader = csv.DictReader(io.StringIO(csv_text))
    saved = []
    for row in reader:
        if Question.objects.filter(question=row['question']).exists():
            continue
        question = Question(
            question=row['question'].strip(),
            topic=row['topic'].strip(),
            subject=row['subject'].strip(),
            q_type=test_type,
            option1=row.get('opt1', '').strip() or None,
            option2=row.get('opt2', '').strip() or None,
            option3=row.get('opt3', '').strip() or None,
            option4=row.get('opt4', '').strip() or None,
            answer=row.get('answer', '').strip() or None,
            level=row['level'].strip()
        )
        question.save()
        saved.append(question.id)
    return saved
import traceback
def index(request):
    if request.user.is_authenticated:
        return redirect('/dashboard')
    if request.method == 'POST':
        form = IndexForm(request.POST)
        files = request.FILES.getlist('file_input')
        if form.is_valid():
            text = form.cleaned_data['text_content']
            test_type = form.cleaned_data['test_type']
        
            file_text = ''
            for file in files:
                file_text += extract_text_from_file(file) + "\n"
            full_text = text.strip() + "\n" + file_text.strip()
            
            prompt = ''
            if test_type == 'mcq':
                prompt = "Generate 10 mcq question based on the given text. Give output in csv format, don't forget to give the column name but keep it like this - 'topic', 'subject', 'question', 'opt1', 'opt2', 'opt3', 'opt4', 'answer', 'level'. subject should be the subject from which the question is (college subjects). topic name should be of the subject. topic from which the question is, not the subject. level should be the question's level based on easy, medium and hard. Make sure answer is one of the options exactly as it is. Don't forget to double quote the data so that it's csv can be read ignoring extra commas. Also, only give csv part and don't write anything else"
            elif test_type == 'conceptual':
                prompt = "Generate 5 conceptual question based on the given text. Give output in csv format, don't forget to give the column name but keep it like this - 'topic', 'subject', 'question', 'answer', 'level'. subject should be the subject from which the question is (college subjects). topic name should be of the of the subject. topic from which the question is, not the subject. level should be the question's level based on easy, medium and hard. Answers shouldn't exceed 512 characters, but around 350-450 is fine. Don't forget to double quote the data so that it's csv can be read ignoring extra commas. Also, only give csv part and don't write anything else"
            elif test_type == 'speed':
                prompt = "Generate 10 question with short answer (one word answers preferable) based on the given text. Give output in csv format, don't forget to give the column name but keep it like this - 'topic', 'subject', 'question', 'answer', 'level'. subject should be the subject from which the question is (college subjects). topic name should be of the subject. topic from which the question is, not the subject. level should be the question's level based on easy, medium and hard. Don't forget to double quote the data so that it's csv can be read ignoring extra commas. Also, only give csv part and don't write anything else"
            full_text = full_text + " " + prompt
            try:
                response = requests.post(
                    API_URL,
                    json={'prompt': full_text},
                    timeout=60,
                )
                if response.status_code == 200:
                    raw_response = response.json()["response"]
                    if raw_response.startswith("```csv"):
                        raw_response = raw_response[6:]
                    if raw_response.endswith("```"):
                        raw_response = raw_response[:-3]
                    try:
                        csv_text = response.json()["response"]
                        question_ids = save_questions_from_csv(csv_text=csv_text, test_type=test_type)
                        request.session['question_ids'] = question_ids
                        return redirect(f"/test-{test_type}")
                    except Exception as e:
                        traceback.print_exc()
                        request.session['notification'] = "Test generation failed, try again..."
                        request.session['notification_type'] = "error"
                        return redirect('/')
                elif response.status_code == 500:
                    request.session['notification'] = response.json()["error"]
                    request.session['notification_type'] = "error"
                else:
                    request.session['notification'] = "Unexpected error occured!"
                    request.session['notification_type'] = "error"
            except Exception as e:
                request.session['notification'] = f"Failed to create test! ({e})"
                request.session['notification_type'] = "error"

    else:
        form = IndexForm()
    score = request.session.pop('score', None)
    return render(request, 'index.html', {'form': form, 'score': json.dumps(score, cls=DjangoJSONEncoder)})





def clear_notifications(request):
    request.session.pop('notification', None)
    request.session.pop('notification_type', None)
    return JsonResponse({'status': 'cleared'})
