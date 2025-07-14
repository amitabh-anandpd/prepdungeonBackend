# prepdungeon/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, UserProfile,
    DailyEvent, UserDailyQuest, CompletedDailyQuest,
    Question, CompletedTest, UserAnswer
)


# -------------------------
# Inline for UserProfile
# -------------------------
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "Profile"
    fk_name = 'user'


# -------------------------
# Custom User admin
# -------------------------
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = [UserProfileInline]

    list_display = (
        'username', 'email', 'first_name', 'last_name', 'is_staff',
        'get_level', 'get_points'
    )
    list_select_related = ('profile',)

    def get_level(self, instance):
        return instance.profile.level
    get_level.short_description = 'Level'

    def get_points(self, instance):
        return instance.profile.points
    get_points.short_description = 'Points'


# -------------------------
# Daily‑quest related
# -------------------------
@admin.register(DailyEvent)
class DailyEventAdmin(admin.ModelAdmin):
    list_display = ('name', 'xp_reward', 'points_reward', 'date_created')
    search_fields = ('name',)


@admin.register(UserDailyQuest)
class UserDailyQuestAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'xp_reward', 'points_reward', 'date_created')
    list_filter = ('date_created', 'user')
    search_fields = ('name', 'user__username')


@admin.register(CompletedDailyQuest)
class CompletedDailyQuestAdmin(admin.ModelAdmin):
    list_display = ('user', 'quest', 'date_completed')
    list_filter = ('date_completed', 'user')
    search_fields = ('user__username', 'quest__name')


# -------------------------
# Question bank
# -------------------------
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question', 'topic', 'subject', 'q_type', 'level')
    list_filter = ('q_type', 'subject', 'level')
    search_fields = ('question', 'topic', 'subject')


# -------------------------
# Inline UserAnswer for CompletedTest
# -------------------------
class UserAnswerInline(admin.TabularInline):
    model = UserAnswer
    extra = 0
    readonly_fields = ('question', 'answer_text')
    can_delete = False


@admin.register(CompletedTest)
class CompletedTestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'score', 'percentage')
    list_filter = ('user',)
    inlines = [UserAnswerInline]
    readonly_fields = ('analysis',)
