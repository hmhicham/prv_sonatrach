# from django.urls import path
# from . import views

# app_name = 'accounts'

# urlpatterns = [
#     path('', views.home_view, name='home'),
#     path('register/', views.register_view, name='register'),
#     path('login/', views.login_view, name='login'),
#     path('logout/', views.logout_view, name='logout'),
    
# ]


from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    # path('home/', views.home_view, name='home'),
    # path('auth-status/', views.auth_status_view, name='auth_status'),  # Added auth status endpoint
]
