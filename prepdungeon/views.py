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

env_path = settings.BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(env_path)

from .forms import IndexForm, LoginForm, SignupForm, ContactUsForm
from .models import Question, User, UserAnswer, UserProfile, UserDailyQuest, CompletedTest
from .models import Waitlist, ContactUsEmail

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
                user.username = user.email
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

def studyGuide(request):
    return render(request, 'study-guide.html', {
        "user": request.user,
        
    })

def testCenter(request):
    return render(request, 'test-center.html')

def testMCQ(request):
    if not request.session.get('question_ids'):
        request.session['notification'] = "No questions available!"
        request.session['notification_type'] = "info"
        referer = request.META.get('HTTP_REFERER')
        if referer:
            return redirect(referer)
        else:
            return redirect('/dashboard') 
    question_ids = request.session['question_ids']
    questions = Question.objects.filter(id__in=question_ids)
    question_list = []
    for q in questions:
        question_list.append({
            'id': q.id,
            'question': q.question,
            'options': [opt for opt in [q.option1, q.option2, q.option3, q.option4] if opt],
        })
    return render(request, 'test-mcq.html', {
        'questions': question_list,
    })

def checkMCQ(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_answers   = data.get('userAnswers', [])
        timePerQuestion = data.get('timePerQuestion')
        question_ids   = request.session.get('question_ids', [])
        qs = Question.objects.filter(id__in=question_ids)
        question_map = {q.id: q for q in qs}
        correct = 0
        for i, qid in enumerate(question_ids):
            q = question_map.get(qid)
            if not q:
                continue
            try:
                correct_idx = [opt for opt in [q.option1, q.option2, q.option3, q.option4] if opt].index(q.answer)
            except:
                continue
            if correct_idx==user_answers[i]:
                correct+=1
        
        total = len(question_ids)
        score = round((correct/total)*100)
        
        request.session['score'] = {
            'test_type': data.get('test_type'),
            'score': score,
            'correct': correct,
            'total': data.get('totalQuestions'),
            'time': data.get('timeSpent'),
            'timePerQuestion': timePerQuestion,
        }
        result_dict = str(request.session['score'])
        questions_dict = str(Question.objects.filter(id__in=request.session['question_ids']))
        request.session.pop('question_ids')
        prompt = " Give me an analysis on the basis of the given test question and results"
        prompt = prompt + "I need score of 'quickRecall', 'detailAttention', 'patternRecognition', 'conceptApplication'"
        prompt = prompt + " in percentage (only numbers) in csv format. Use column names as I have given. Don't give anything else other than csv data and write each data cell inside double quotation marks so that unnecessary commas are not included "
        try:
            response = requests.post(
                API_URL,
                json={'prompt': result_dict+questions_dict+prompt},
                timeout=60,
            )
            if response.status_code == 200:
                try:
                    reader = csv.DictReader(io.StringIO(response.json()['response']))
                    saved = []
                    for row in reader:
                        saved.append(row)
                    request.session['score'] = {
                        'test_type': data.get('test_type'),
                        'score': score,
                        'correct': correct,
                        'total': data.get('totalQuestions'),
                        'time': data.get('timeSpent'),
                        'timePerQuestion': timePerQuestion,
                        'quickRecall': row['quickRecall'],
                        'detailAttention': row['detailAttention'],
                        'patternRecognition': row['patternRecognition'],
                        'conceptApplication': row['conceptApplication'],
                    }
                    if request.user.is_authenticated:
                        completed_test = CompletedTest.objects.create(
                            user=request.user,
                            test_type=data.get('test_type'),
                            score=score,
                            analysis=json.dumps(saved),
                            time_spent=data.get('timeSpent'),
                        )
                        i=0
                        for qid, selected in zip(question_ids, user_answers):
                            question = Question.objects.get(id=qid)
                            UserAnswer.objects.create(
                                user=request.user,
                                completed_test=completed_test,
                                question=question,
                                answer_text=str(selected),
                                time_spent=timePerQuestion[i]
                            )
                            i+=1
                except Exception as e:
                    print(e)
            elif response.status_code == 500:
                request.session['notification'] = response.json()["error"]
                request.session['notification_type'] = "error"
            else:
                request.session['notification'] = "Unexpected error occured!"
                request.session['notification_type'] = "error"
        except Exception as e:
            request.session['notification'] = f"Failed to get analysis! ({e})"
            request.session['notification_type'] = "error"
        return JsonResponse({'status': 'ok'})
    return JsonResponse({"error": "Only POST allowed"}, status=405)

def testSpeed(request):
    if not request.session.get('question_ids'):
        request.session['notification'] = "No questions available!"
        request.session['notification_type'] = "info"
        referer = request.META.get('HTTP_REFERER')
        if referer:
            return redirect(referer)
        else:
            return redirect('/dashboard') 
    question_ids = request.session['question_ids']
    questions = Question.objects.filter(id__in=question_ids)
    return render(request, 'test-speed.html', {
        'questions': questions,
    })

def checkSpeed(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_answers = data.get('userAnswers', [])
        timePerQuestion = data.get('timePerQuestion')
        question_ids = request.session.get('question_ids', [])
        qs = Question.objects.filter(id__in=question_ids)
        qs_dict = {str(q.id): q for q in qs}

        answers = []
        for i in range(len(question_ids)):
            qid = str(question_ids[i])
            question_obj = qs_dict.get(qid)

            if question_obj:
                answers.append({
                    'question': question_obj.question,
                    'user_answer': user_answers[i],
                    'intended_answer': question_obj.answer,
                    'time_taken': timePerQuestion[i],
                })
        answers = json.dumps(answers)
        total = len(question_ids)
        
        request.session.pop('question_ids')
        prompt = f"{answers}\n Give me an analysis on the basis of the given test question, user-answer and what correct answer is"
        prompt = prompt + "I need score of 'quickProcessing', 'timeManagement', 'accuracyFocus', 'speed', 'score'"
        prompt = prompt + " in percentage (only numbers) in csv format. Use column names as I have given. Don't give anything else other than csv data and write each data cell inside double quotation marks so that unnecessary commas are not included."
        prompt = prompt + " Calculate score from a max of 5 marks per question and give marks based on user-answer."
        try:
            response = requests.post(
                API_URL,
                json={'prompt': prompt},
                timeout=60,
            )
            if response.status_code == 200:
                try:
                    reader = csv.DictReader(io.StringIO(response.json()['response']))
                    saved = []
                    for row in reader:
                        saved.append(row)
                    request.session['score'] = {
                        'test_type': data.get('test_type'),
                        'score': row['score'],
                        'total': data.get('totalQuestions'),
                        'time': data.get('timeSpent'),
                        'timePerQuestion': timePerQuestion,
                        'quickProcessing': row['quickProcessing'],
                        'timeManagement': row['timeManagement'],
                        'accuracyFocus': row['accuracyFocus'],
                        'speed': row['speed'],
                    }
                    if request.user.is_authenticated:
                        completed_test = CompletedTest.objects.create(
                            user=request.user,
                            test_type=data.get('test_type'),
                            score=row['score'],
                            analysis=json.dumps(saved),
                            time_spent=data.get('timeSpent'),
                        )
                        for i in range(len(question_ids)):
                            qid = str(question_ids[i])
                            question_obj = qs_dict.get(qid)
                            UserAnswer.objects.create(
                                user=request.user,
                                completed_test=completed_test,
                                question=question_obj,
                                answer_text=user_answers[i],
                                time_spent=timePerQuestion[i],
                            )
                except Exception as e:
                    print(e)
            elif response.status_code == 500:
                request.session['notification'] = response.json()["error"]
                request.session['notification_type'] = "error"
            else:
                request.session['notification'] = "Unexpected error occured!"
                request.session['notification_type'] = "error"
        except Exception as e:
            request.session['notification'] = f"Failed to get analysis! ({e})"
            request.session['notification_type'] = "error"
        return JsonResponse({'status': 'ok'})
    return JsonResponse({"error": "Only POST allowed"}, status=405)

def testConceptual(request):
    if not request.session.get('question_ids'):
        request.session['notification'] = "No questions available!"
        request.session['notification_type'] = "info"
        referer = request.META.get('HTTP_REFERER')
        if referer:
            return redirect(referer)
        else:
            return redirect('/dashboard') 
    question_ids = request.session['question_ids']
    questions = Question.objects.filter(id__in=question_ids)
    return render(request, 'test-conceptual.html', {
        'questions': questions,
    })

def checkConceptual(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_answers = data.get('userAnswers', [])
        timePerQuestion = data.get('timePerQuestion')
        question_ids = request.session.get('question_ids', [])
        qs = Question.objects.filter(id__in=question_ids)
        qs_dict = {str(q.id): q for q in qs}

        answers = []
        for i in range(len(question_ids)):
            qid = str(question_ids[i])
            question_obj = qs_dict.get(qid)

            if question_obj:
                answers.append({
                    'question': question_obj.question,
                    'user_answer': user_answers[i],
                    'intended_answer': question_obj.answer,
                    'time_taken': timePerQuestion[i],
                })
        answers = json.dumps(answers)
        total = len(question_ids)
        
        request.session.pop('question_ids')
        prompt = f"{answers}\n Give me an analysis on the basis of the given test question, user-answer and what correct answer is"
        prompt = prompt + "I need score of 'deepUnderstanding', 'criticalThinking', 'problemSolving', 'memoryRetention', 'score'"
        prompt = prompt + " in percentage (only numbers) in csv format. Use column names as I have given. Don't give anything else other than csv data and write each data cell inside double quotation marks so that unnecessary commas are not included."
        prompt = prompt + " Calculate score from a max of 5 marks per question and give marks based on user-answer."
        try:
            response = requests.post(
                API_URL,
                json={'prompt': prompt},
                timeout=60,
            )
            if response.status_code == 200:
                try:
                    reader = csv.DictReader(io.StringIO(response.json()['response']))
                    saved = []
                    for row in reader:
                        saved.append(row)
                    request.session['score'] = {
                        'test_type': data.get('test_type'),
                        'score': row['score'],
                        'total': data.get('totalQuestions'),
                        'time': data.get('timeSpent'),
                        'deepUnderstanding': row['deepUnderstanding'],
                        'criticalThinking': row['criticalThinking'],
                        'problemSolving': row['problemSolving'],
                        'memoryRetention': row['memoryRetention'],
                    }
                    if request.user.is_authenticated:
                        completed_test = CompletedTest.objects.create(
                            user=request.user,
                            test_type=data.get('test_type'),
                            score=row['score'],
                            analysis=json.dumps(saved),
                            time_spent=data.get('timeSpent')
                        )
                        for i in range(len(question_ids)):
                            qid = str(question_ids[i])
                            question_obj = qs_dict.get(qid)
                            UserAnswer.objects.create(
                                user=request.user,
                                completed_test=completed_test,
                                question=question_obj,
                                answer_text=user_answers[i],
                                time_spent=timePerQuestion[i],
                            )
                except Exception as e:
                    print(e)
            elif response.status_code == 500:
                request.session['notification'] = response.json()["error"]
                request.session['notification_type'] = "error"
            else:
                request.session['notification'] = "Unexpected error occured!"
                request.session['notification_type'] = "error"
        except Exception as e:
            request.session['notification'] = f"Failed to get analysis! ({e})"
            request.session['notification_type'] = "error"
        return JsonResponse({'status': 'ok'})
    return JsonResponse({"error": "Only POST allowed"}, status=405)

def clear_question_ids(request):
    request.session.pop('question_ids', None)
    return JsonResponse({'status': 'cleared'})

def clear_notifications(request):
    request.session.pop('notification', None)
    request.session.pop('notification_type', None)
    return JsonResponse({'status': 'cleared'})

def dailyQuest(request):
    daily_quests = UserDailyQuest.objects.filter(user=request.user, date_created=timezone.now().date(), is_completed=False)
    completed_quests = UserDailyQuest.objects.filter(user=request.user, date_created=timezone.now().date(), is_completed=True)
    return render(request, 'daily-quest.html', {
        'daily_quests': daily_quests,
        'completed_quests': completed_quests,
    })

def check_quest_completion(request, type):
    user_quests = UserDailyQuest.objects.filter(user=request.user, date_created=timezone.now().date())
    for user_quest in user_quests:
        if type == user_quest.daily_quest.quest_type:
            user_quest.is_completed = True
            user_quest.save()
            request.sesion['notification'] = "Quest Completed!"
            request.sesion['notification_type'] = "success"

def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        request.session["notification"] = "Logged out successfully!"
        request.session["notification_type"] = "success"
        return redirect("/auth")
    request.session['notification'] = "Couldn't Log out!"
    request.session['notification_type'] = "error"
    return redirect("/profile")

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