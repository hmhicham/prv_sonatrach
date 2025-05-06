from django.urls import path
from . import views

app_name = 'frontend'

urlpatterns = [
    path('index/', views.index, name='index'),
    
]
