from django.urls import path
from .views import (
    ConcessionListView,
    PhaseListView,
    ContractListView,
    SeismicListView,
    WellListView,
    GgStudiesListView,
    FracturationListView,
    CommitementListView,
    EngagementDetailView,
    SearchAPIView,
    ConcessionMapView,
    BlocMapView,
    WellMapView,
    SeismicMapView,DemandeListView,  # Add this line
    DemandeCreateView ,SavePolygonAPIView,SubordinatesAPIView,auth_status_view,AuthStatusView,PolygonDetailView,DepartementListView,SeismicForecastView,DrillingForecastView,ExplorationForecastView
)
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.urls import re_path

urlpatterns = [
    path('concessions/', ConcessionListView.as_view(), name='concession-list'),
    path('concessions/<str:name>/', ConcessionListView.as_view(), name='concession-detail'),
    path('phases/', PhaseListView.as_view(), name='phase-list'),
    path('contracts/', ContractListView.as_view(), name='contract-list'),
    path('demandes/', DemandeListView.as_view(), name='demande-list'),
    path('demandes/create/', DemandeCreateView.as_view(), name='demande-create'),

    # programme ---------------#
    path('sismiques/', SeismicListView.as_view(), name='seismic-list'),
    path('sismiques/<str:name>/', SeismicListView.as_view(), name='seismic-detail'),
    path('puits/', WellListView.as_view(), name='well-list'),
    path('etudes/', GgStudiesListView.as_view(), name='ggstudies-list'),
    path('fracturation/', FracturationListView.as_view(), name='fracturation-list'),


        # Engagements for Perimetres page
    path('commitments/', CommitementListView.as_view(), name='commitment-list'),
    path('commitments/details/', EngagementDetailView.as_view(), name='engagement-details'),

     # New URLs for map functionality
    path('search/', SearchAPIView.as_view(), name='search'),
    path('map/concessions/', ConcessionMapView.as_view(), name='concessions-map'),
    path('map/blocs/', BlocMapView.as_view(), name='blocs-map'),
    path('map/wells/', WellMapView.as_view(), name='wells-map'),
    path('map/seismic/', SeismicMapView.as_view(), name='seismic-map'),
    path('save-polygon/', csrf_exempt(SavePolygonAPIView.as_view()), name='save-polygon'),
    # New endpoint for polygon details
    path('map/polygon-details/<str:identifier>/', PolygonDetailView.as_view(), name='polygon-details'),
    path('departements/', DepartementListView.as_view(), name='departement-list'),
    # New endpoint for subordinates
    path('subordinates/', SubordinatesAPIView.as_view(), name='subordinates'),
    path('auth-status/', auth_status_view, name='auth-status'),
    path('auth-status/', AuthStatusView.as_view(), name='auth_status'),
    # planning sismique
    path('forecasts/<str:sisProg>/', SeismicForecastView.as_view(), name='seismic_forecast'),
    path('forecasts/', SeismicForecastView.as_view(), name='save_seismic_forecast'),
    # planning forage
    path('drilling-forecasts/<str:well_name>/', DrillingForecastView.as_view(), name='drilling-forecast'),
    # path('api/drilling-forecasts/', DrillingForecastView.as_view(), name='save_drilling_forecast'),
    path('wells/', WellListView.as_view(), name='well-list'),
    path('exploration-forecasts/<str:perimeter_name>/', ExplorationForecastView.as_view(), name='exploration-forecast'),





    
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')),  # Catch-all for React app

    
]