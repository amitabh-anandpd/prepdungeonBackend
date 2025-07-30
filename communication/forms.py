from django import forms


class ContactUsForm(forms.Form):
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('support', 'Support Request'),
        ('feedback', 'Feedback'),
        ('partnership', 'Partnership Opportunity'),
        ('bug', 'Bug Report'),
        ('feature', 'Feature Request'),
    ]

    first_name = forms.CharField(max_length=30)
    last_name = forms.CharField(max_length=30)
    email = forms.EmailField()
    subject = forms.ChoiceField(choices=SUBJECT_CHOICES)
    message = forms.CharField(widget=forms.Textarea)
