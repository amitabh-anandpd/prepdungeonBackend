from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.db import transaction
import json

class User(AbstractUser):

    def __str__(self):
        return f"{self.username}"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        with transaction.atomic():
            super().save(*args, **kwargs)
            if is_new:
                UserProfile.objects.create(user=self)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "profile": self.profile.to_dict(),
        }

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    points = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    last_active = models.DateField(null=True, blank=True)
    
    college = models.CharField(max_length=128, null=True, blank=True)
    stream = models.CharField(max_length=64, null=True, blank=True)
    
    friends = models.ManyToManyField("self", blank=True, symmetrical=False)

    def __str__(self):
        return f"{self.user.username} - Level {self.level}"

    def add_xp(self, amount):
        self.xp += amount
        self.check_level_up()
        self.save()
    
    def add_points(self, amount):
        self.points += amount
        self.save()
    
    def remove_points(self, amount):
        if amount > self.points:
            raise ValueError("Not enough points to remove")
        self.points -= amount
        self.save()
    
    def update_streak(self):
        today = timezone.now().date()
        if self.last_active == today:
            return
        elif self.last_active == today - timezone.timedelta(days=1):
            self.streak += 1
        else:
            self.streak = 1
        self.last_active = today
        self.save()

    def check_level_up(self):
        next_level = 50 * self.level * (self.level+1)
        if self.xp >= next_level:
            self.level += 1
            self.xp = self.xp - next_level
            self.check_level_up()
    @property
    def xp_progress_percentage(self):
        if self.level == 0:
            return 0
        return int((2 * self.xp) / (self.level * (1 + self.level)))
    @property
    def xp_to_next_level(self):
        next_level = 50 * self.level * (self.level+1)
        return next_level - self.xp
    @property
    def total_xp(self):
        total = 0
        for i in range(self.level):
            total += 50 * i * (i+1)
        total += self.xp
        return total
    def get_friend_list(self):
        friends_list = [
            {
                "username": friend.user.username,
                "id": friend.user.id,
            }
            for friend in self.friends.all()
        ]
        return friends_list
    def to_dict(self):
        return {
            "xp": self.xp,
            "level": self.level,
            "points": self.points,
            "streak": self.streak,
            "last_active": self.last_active,
            "college": self.college,
            "stream": self.stream,
            "xp_progress_percentage": self.xp_progress_percentage,
            "xp_to_next_level": self.xp_to_next_level,
            "total_xp": self.total_xp,
            "friends": self.get_friend_list(),
        }

class DailyEvent(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField()
    xp_reward = models.IntegerField(default=100)
    points_reward = models.IntegerField(default=20)
    date_created = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "xp_reward": self.xp_reward,
            "points_reward": self.points_reward,
            }

class DailyQuest(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    xp_reward = models.IntegerField(default=25)
    points_reward = models.IntegerField(default=5)
    quest_type = models.CharField(max_length=50, choices=[
        ('read_material', 'Read Study Material'),
        ('complete_test', 'Complete a Test'),
        ('upload_document', 'Upload a Document'),
        ('score_90', "Score 90% or higher"),
        ('score_80', 'Score 80% or higher'),
        ('complete_3_tests', 'Complete 3 Tests'),
    ])

    def __str__(self):
        return self.name
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "xp_reward": self.xp_reward,
            "points_reward": self.points_reward,
            "quest_type": self.quest_type,
        }

class UserDailyQuest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="daily_quests")
    daily_quest = models.ForeignKey(DailyQuest, on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        status = "Completed" if self.is_completed else "Pending"
        return f"{self.user.username}'s quest: {self.daily_quest.name} ({status})"
    
    class Meta:
        unique_together = ('user', 'daily_quest', 'date_created')
        verbose_name = "User Daily Quest"
        verbose_name_plural = "User Daily Quests"
        
    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user.to_dict(),
            "daily_quest": self.daily_quest.to_dict(),
            "is_completed": self.is_completed,
            }

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

class UserPhoto(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile_photo')
    photo = models.ImageField(upload_to='profile_photos')
    
class Waitlist(models.Model):
    name = models.CharField(max_length=128, null=False, blank=False)
    email = models.EmailField(null=False, blank=False)
    raw_score = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def set_score(self, score_dict: dict):
        self.raw_score = json.dumps(score_dict, separators=(",", ":"))
        self.save(update_fields=["raw_score"])

    def get_score(self):
        if self.raw_score:
            try:
                return json.loads(self.raw_score)
            except json.JSONDecodeError:
                pass
        return None

    def __str__(self):
        return f"{self.name} <{self.email}>"

class ContactUsEmail(models.Model):
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('support', 'Support Request'),
        ('feedback', 'Feedback'),
        ('partnership', 'Partnership Opportunity'),
        ('bug', 'Bug Report'),
        ('feature', 'Feature Request'),
    ]
    email = models.EmailField(null=False)
    subject = models.CharField(choices=SUBJECT_CHOICES, max_length=32, null=False)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    message = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)