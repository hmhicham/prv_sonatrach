# from django.shortcuts import render, redirect
# from django.contrib.auth import authenticate, login, logout
# from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
# from django.contrib import messages

from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.cache import never_cache
from .forms import LoginForm, RegisterForm

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import UserProfile




@never_cache
def login_view(request):
    if request.user.is_authenticated:
        
        request.session.save()

        return redirect('http://127.0.0.1:8000/')

    if request.method == 'POST':
        form = LoginForm(data=request.POST, request=request)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            request.session.save()
            messages.success(request, f"Welcome, {user.username}!")
            return redirect('http://127.0.0.1:8000/')  # Redirect to frontend home
        else:
            messages.error(request, "Invalid username or password.")
            form = LoginForm(request=request)
    else:
        form = LoginForm(request=request)

    return render(request, 'accounts/login.html', {'form': form})

@never_cache
def register_view(request):
    if request.user.is_authenticated:
        return redirect('http://localhost:3000/')

    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Create a UserProfile with default values
            UserProfile.objects.create(
                user=user,
                is_manager=False  # Default to non-manager unless specified
            )
            login(request, user)
            messages.success(request, f"Account created successfully, {user.username}!")
            return redirect('http://localhost:3000/')
        else:
            messages.error(request, "Please correct the errors below.")
            form = RegisterForm()
    else:
        form = RegisterForm()

    return render(request, 'accounts/register.html', {'form': form})
    
@csrf_exempt
def logout_view(request):
    logout(request)
    messages.success(request, "You have been logged out successfully.")
    return redirect('http://127.0.0.1:8000/login/')

# @csrf_exempt
# def auth_status_view(request):
#     if request.user.is_authenticated:
#         user_profile = UserProfile.objects.get(user=request.user)
#         return JsonResponse({
#             'is_authenticated': True,
#             'username': request.user.username,
#             'is_manager': user_profile.is_manager,
#         })
#     return JsonResponse({
#         'is_authenticated': False,
#     })

# @login_required
# def home_view(request):
#     return redirect('http://127.0.0.1:8000/')






# def login_view(request):
#     # Check if the user is already authenticated; redirect to home if so
#     if request.user.is_authenticated:
#         return redirect('accounts:home')
        
#     if request.method == 'POST':
#         form = AuthenticationForm(request, data=request.POST)
#         if form.is_valid():
#             username = form.cleaned_data.get('username')
#             password = form.cleaned_data.get('password')
#             user = authenticate(username=username, password=password)
#             if user is not None:
#                 login(request, user)
#                 # messages.success(request, f"Welcome, {username}!")
#                 return redirect('accounts:home')  # Replace with your desired redirect
#             else:
#                 messages.error(request, "Invalid username or password.")
#         else:
#             messages.error(request, "Invalid username or password.")
#     else:
#         form = AuthenticationForm()
#     return render(request, 'accounts/login.html', {'form': form})

# def logout_view(request):
#     logout(request)
#     messages.success(request, "You have been logged out.")
#     return redirect('accounts:login')

# def register_view(request):
#     if request.method == 'POST':
#         form = UserCreationForm(request.POST)
#         if form.is_valid():
#             form.save()
#             username = form.cleaned_data.get('username')
#             messages.success(request, f"Account created for {username}!")
#             return redirect('accounts:login')
#     else:
#         form = UserCreationForm()
#     return render(request, 'accounts/register.html', {'form': form})

# def home_view(request):
#     if request.user.is_authenticated:
#         return render(request,'accounts/home.html', {'username': request.user.username})
#     else:
#         return redirect('accounts:login')