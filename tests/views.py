from django.conf import settings
from django.shortcuts import render, redirect
from django.http import JsonResponse
import json
import requests
import csv
import io
import os

from .models import Question, UserAnswer, CompletedTest


from dotenv import load_dotenv
env_path = settings.BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(env_path)


API_URL = os.getenv("API_URL")

# Create your views here.
def studyGuide(request):
    return render(request, 'study-guide.html', {
        "user": request.user,
        
    })

def testCenter(request):
    return render(request, 'test-center.html', {'user': request.user})

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
