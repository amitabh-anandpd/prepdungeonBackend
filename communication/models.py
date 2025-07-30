from django.db import models
import json
# Create your models here.

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