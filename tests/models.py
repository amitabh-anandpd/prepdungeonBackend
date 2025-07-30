from django.db import models
from accounts.models import User

# Create your models here.

class Question(models.Model):
    question = models.CharField(max_length=256, null=False)
    topic = models.CharField(max_length=128, null=False, default="Misc")
    subject = models.CharField(max_length=128, null=False, default="Misc")
    TYPE_CHOICES = [
        ('mcq', 'MCQ'),
        ('conceptual', 'Conceptual'),
        ('speed', 'Speed'),
    ]
    q_type = models.CharField(choices=TYPE_CHOICES, max_length=16, null=False)
    option1 = models.CharField(max_length=256, null=True)
    option2 = models.CharField(max_length=256, null=True)
    option3 = models.CharField(max_length=256, null=True)
    option4 = models.CharField(max_length=256, null=True)
    answer = models.CharField(max_length=512, null=True)
    LEVEL_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    level = models.CharField(choices=LEVEL_CHOICES, max_length=16, null=False)
    
    def __str__(self):
        return self.question
    def to_dict(self):
        return {
            "id": self.id,
            "question": self.question,
            "topic": self.topic,
            "subject": self.subject,
            "q_type": self.q_type,
            "option1": self.option1,
            "option2": self.option2,
            "option3": self.option3,
            "option4": self.option4,
            "answer": self.answer,
            "level": self.level,
            }




class CompletedTest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='completed_tests')
    TYPE_CHOICES = [
        ('mcq', 'MCQ'),
        ('conceptual', 'Conceptual'),
        ('speed', 'Speed'),
    ]
    test_type = models.CharField(choices=TYPE_CHOICES, max_length=16, default="MCQ", null=False)
    score = models.IntegerField(default=0)
    analysis = models.TextField(default="No analysis available")
    time_spent = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def questions(self):
        return Question.objects.filter(useranswer__completed_test=self).distinct()
    def to_dict(self):
        return {
            "user": self.user.to_dict(),
            "score": self.score,
            "analysis": self.analysis,
            "questions": self.questions,
            "time_spent": self.time_spent,
            "created_at": self.created_at,
        }

class UserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_answers', default=None)
    completed_test = models.ForeignKey(CompletedTest, on_delete=models.CASCADE, related_name="user_answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.TextField()
    time_spent = models.IntegerField(default=0)

    def __str__(self):
        return f"Answer to Q{self.question.id} in Test {self.completed_test.id}"

