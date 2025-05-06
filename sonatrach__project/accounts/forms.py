# from django import forms
# from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
# from django.contrib.auth.models import User  # Change this line

# class RegisterForm(UserCreationForm):
#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password1', 'password2']

# class LoginForm(AuthenticationForm):
    # username = forms.CharField(label='Username')
#     password = forms.CharField(label='Password', widget=forms.PasswordInput)


from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User

class LoginForm(AuthenticationForm):
    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        super().__init__(*args, **kwargs)

    username = forms.CharField(
        max_length=254,
        widget=forms.TextInput(attrs={'class': 'input-field', 'placeholder': 'Enter your username'}),
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'input-field', 'placeholder': 'Enter your password'}),
    )

    class Meta:
        fields = ['username', 'password']

class RegisterForm(UserCreationForm):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'input-field', 'placeholder': 'Enter your email'}),
        required=True
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'input-field', 'placeholder': 'Choose a username'}),
            'password1': forms.PasswordInput(attrs={'class': 'input-field', 'placeholder': 'Enter your password'}),
            'password2': forms.PasswordInput(attrs={'class': 'input-field', 'placeholder': 'Confirm your password'}),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email address is already in use.")
        return email