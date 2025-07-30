from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.db import transaction

# Create your models here.
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



class UserPhoto(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile_photo')
    photo = models.ImageField(upload_to='profile_photos')


