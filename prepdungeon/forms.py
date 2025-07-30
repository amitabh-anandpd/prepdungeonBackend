from django import forms
from django.contrib.auth.forms import AuthenticationForm



class IndexForm(forms.Form):
    text_content = forms.CharField(
        widget=forms.Textarea(attrs={'placeholder': 'Paste your syllabus...'}),
        required=False
    )
    test_type = forms.CharField(widget=forms.HiddenInput())