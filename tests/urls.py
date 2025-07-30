from django.urls import path
from . import views
from tests.views import  studyGuide, testCenter
from tests.views import testMCQ, checkMCQ, testSpeed, checkSpeed, testConceptual, checkConceptual, clear_question_ids



urlpatterns = [
    path('study-guide/', studyGuide, name='study-guide'),
    path('test-center/', testCenter, name='test-center'),
    path('test-mcq/', testMCQ, name='test-mcq'),
    path('test-speed/', testSpeed, name='test-speed'),
    path('test-conceptual/', testConceptual, name='test-conceptual'),
    path('clear-question-ids/', clear_question_ids, name="clear_question_ids"),
    path('submit-mcq/', checkMCQ, name="checkMCQ"),
    path('submit-speed/', checkSpeed, name="checkSpeed"),
    path('submit-conceptual/', checkConceptual, name="checkConceptual"),
]