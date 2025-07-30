from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils import timezone
from .models import UserDailyQuest, DailyQuest # Import models from the same app
from accounts.models import UserProfile # Import UserProfile to update XP/level

# Create your views here.
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