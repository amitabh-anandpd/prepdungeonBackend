from django.db import models
from accounts.models import User

# Create your models here.
class DailyQuest(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    xp_reward = models.IntegerField(default=25)
    points_reward = models.IntegerField(default=5)
    rank = models.CharField(max_length=1, choices=[('S', 'S'), ('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')], default='C')
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
