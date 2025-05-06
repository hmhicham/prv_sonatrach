# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from accounts.models import Concession, Demande, Phase, Contract, Seismic, Well, GgStudies, Fracturation
# from .serializers import ConcessionSerializer, DemandeSerializer, PhaseSerializer, ContractSerializer, SeismicSerializer, WellSerializer, GgStudiesSerializer, FracturationSerializer
# from django.core.files.base import ContentFile
# import base64

# class ConcessionListView(APIView):
#     def get(self, request):
#         concessions = Concession.objects.all()
#         serializer = ConcessionSerializer(concessions, many=True)
#         return Response(serializer.data)

# class PhaseListView(APIView):
#     def get(self, request):
#         phases = Phase.objects.all()
#         serializer = PhaseSerializer(phases, many=True)
#         return Response(serializer.data)

# class ContractListView(APIView):
#     def get(self, request):
#         contracts = Contract.objects.all()
#         serializer = ContractSerializer(contracts, many=True)
#         return Response(serializer.data)

# class DemandeListView(APIView):
#     def get(self, request):
#         demandes = Demande.objects.all()
#         serializer = DemandeSerializer(demandes, many=True)
#         return Response(serializer.data)

# class DemandeCreateView(APIView):
#     def post(self, request):
#         data = request.data.copy()
        
#         if 'document_dem' in data and data['document_dem']:
#             file_data = data['document_dem']
#             if ';base64,' in file_data:
#                 format, filestr = file_data.split(';base64,')
#                 ext = format.split('/')[-1]
#                 data['document_dem'] = ContentFile(
#                     base64.b64decode(filestr),
#                     name=f"{data.get('dem_filename', 'demand_doc')}.{ext}"
#                 )
        
#         if 'document_resp' in data and data['document_resp']:
#             file_data = data['document_resp']
#             if ';base64,' in file_data:
#                 format, filestr = file_data.split(';base64,')
#                 ext = format.split('/')[-1]
#                 data['document_resp'] = ContentFile(
#                     base64.b64decode(filestr),
#                     name=f"{data.get('resp_filename', 'response_doc')}.{ext}"
#                 )
        
#         serializer = DemandeSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # programme ---------------#
# class SeismicListView(APIView):
#     def get(self, request):
#         seismics = Seismic.objects.all()
#         serializer = SeismicSerializer(seismics, many=True)
#         return Response(serializer.data)

# class WellListView(APIView):
#     def get(self, request):
#         wells = Well.objects.all()
#         serializer = WellSerializer(wells, many=True)
#         return Response(serializer.data)

# class GgStudiesListView(APIView):
#     def get(self, request):
#         studies = GgStudies.objects.all()
#         serializer = GgStudiesSerializer(studies, many=True)
#         return Response(serializer.data)

# class FracturationListView(APIView):
#     def get(self, request):
#         fracturations = Fracturation.objects.all()
#         serializer = FracturationSerializer(fracturations, many=True)
#         return Response(serializer.data)

# -----------------------------------------------------


from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from accounts.models import Concession, Demande, Phase, Contract, Seismic, Well, GgStudies, Fracturation, Commitement,Bloc,Departement, TransactionLog, UserProfile
from .serializers import (
    ConcessionSerializer, DemandeSerializer, PhaseSerializer, ContractSerializer, 
    SeismicSerializer, WellSerializer, GgStudiesSerializer, FracturationSerializer, CommitementSerializer, BlocSerializer, DepartementSerializer

)
from django.contrib.gis.geos import Polygon, Point, LineString, MultiPolygon, MultiPoint
from django.core.files.base import ContentFile
import base64
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import logging
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

# Custom serializer for engagement details (Step 3 of Perimetres)
class EngagementDetailSerializer(serializers.Serializer):
    label = serializers.CharField()
    contractuel = serializers.FloatField()
    restePhase = serializers.FloatField()
    effectif = serializers.FloatField()
    resteRealiser = serializers.FloatField()

class ConcessionListView(APIView):
    def get(self, request):
        concessions = Concession.objects.all()
        
        # Filtering for PerimeterList page
        search_term = request.query_params.get('search', None)
        dept_asset = request.query_params.get('dept__asset', None)
        status_filter = request.query_params.get('status', None)

        if search_term:
            concessions = concessions.filter(name__icontains=search_term)
        if dept_asset:
            concessions = concessions.filter(dept__asset=dept_asset)
        if status_filter:
            concessions = concessions.filter(status=status_filter)

        serializer = ConcessionSerializer(concessions, many=True)
        return Response(serializer.data)

    def put(self, request, name):
        try:
            concession = Concession.objects.get(name=name)
        except Concession.DoesNotExist:
            return Response({"error": "Concession not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ConcessionSerializer(concession, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, name):
        try:
            concession = Concession.objects.get(name=name)
            concession.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Concession.DoesNotExist:
            return Response({"error": "Concession not found"}, status=status.HTTP_404_NOT_FOUND)

class PhaseListView(APIView):
    def get(self, request):
        phases = Phase.objects.all()
        
        # Filter by perimeter if provided
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            phases = phases.filter(ctr__prm__name=prm_name)
            
        serializer = PhaseSerializer(phases, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PhaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        try:
            phase = Phase.objects.get(pk=pk)
        except Phase.DoesNotExist:
            return Response({"error": "Phase not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PhaseSerializer(phase, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            phase = Phase.objects.get(pk=pk)
            phase.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Phase.DoesNotExist:
            return Response({"error": "Phase not found"}, status=status.HTTP_404_NOT_FOUND)

class ContractListView(APIView):
    def get(self, request):
        contracts = Contract.objects.all()
        
        # Filter by perimeter if provided
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            contracts = contracts.filter(prm__name=prm_name)
            
        serializer = ContractSerializer(contracts, many=True)
        return Response(serializer.data)

class DemandeListView(APIView):
    def get(self, request):
        demandes = Demande.objects.all()
        
        # Filter by perimeter if provided
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            demandes = demandes.filter(ctr__prm__name=prm_name)
            
        serializer = DemandeSerializer(demandes, many=True)
        return Response(serializer.data)

class DemandeCreateView(APIView):
    def post(self, request):
        data = request.data.copy()
        
        if 'document_dem' in data and data['document_dem']:
            file_data = data['document_dem']
            if ';base64,' in file_data:
                format, filestr = file_data.split(';base64,')
                ext = format.split('/')[-1]
                data['document_dem'] = ContentFile(
                    base64.b64decode(filestr),
                    name=f"{data.get('dem_filename', 'demand_doc')}.{ext}"
                )
        
        if 'document_resp' in data and data['document_resp']:
            file_data = data['document_resp']
            if ';base64,' in file_data:
                format, filestr = file_data.split(';base64,')
                ext = format.split('/')[-1]
                data['document_resp'] = ContentFile(
                    base64.b64decode(filestr),
                    name=f"{data.get('resp_filename', 'response_doc')}.{ext}"
                )
        
        serializer = DemandeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# programme ---------------#
class SeismicListView(APIView):
    def get(self, request):
        seismics = Seismic.objects.all()
        
        # Filter by perimeter if provided
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            seismics = seismics.filter(prm__name=prm_name)
            
        serializer = SeismicSerializer(seismics, many=True)
        return Response(serializer.data)

class WellListView(APIView):
    def get(self, request):
        wells = Well.objects.all()
        
        # Filter by perimeter if provided
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            wells = wells.filter(prm__name=prm_name)
            
        serializer = WellSerializer(wells, many=True)
        return Response(serializer.data)

class GgStudiesListView(APIView):
    def get(self, request):
        studies = GgStudies.objects.all()
        
        # Filter by perimeter if provided
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            studies = studies.filter(prm__name=prm_name)
            
        serializer = GgStudiesSerializer(studies, many=True)
        return Response(serializer.data)

class FracturationListView(APIView):
    def get(self, request):
        fracturations = Fracturation.objects.all()
        
        # Filter by perimeter if provided
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            fracturations = fracturations.filter(phase__ctr__prm__name=prm_name)
            
        serializer = FracturationSerializer(fracturations, many=True)
        return Response(serializer.data)

# Custom view for engagement details (Step 3 of Perimetres)
class EngagementDetailView(APIView):
    def get(self, request):
        prm_name = request.query_params.get('prm', None)
        phase_name = request.query_params.get('phase', None)
        
        if not prm_name or not phase_name:
            return Response({"error": "prm and phase parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            commitments = Commitement.objects.filter(phase__ctr__prm__name=prm_name, phase__name=phase_name)
            if not commitments.exists():
                return Response([], status=status.HTTP_200_OK)  # <-- CHANGED

            commitment = commitments.first()
            data = [
                {"label": "Acquisition Sismique 2D (KM)", "contractuel": commitment.s2d_acq, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.s2d_acq},
                {"label": "Acquisition Sismique 3D (KM²)", "contractuel": commitment.s3d_acq, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.s3d_acq},
                {"label": "Retraitement 2D", "contractuel": commitment.retraitement_2d, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.retraitement_2d},
                {"label": "Retraitement 3D", "contractuel": commitment.retraitement_3d, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.retraitement_3d},
                {"label": "Puits Wildcat", "contractuel": commitment.well_wc, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.well_wc},
                {"label": "Puits Délinéation", "contractuel": commitment.well_d, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.well_d},
                {"label": "Puits d’Appréciation", "contractuel": commitment.well_app, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.well_app},
                {"label": "Tests", "contractuel": commitment.well_test, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.well_test},
                {"label": "Études G&G", "contractuel": commitment.gg_studies, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.gg_studies},
                {"label": "Acquisition Gravimétrie", "contractuel": commitment.gravimetry_acquisition, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.gravimetry_acquisition},
                {"label": "Traitement Gravimétrie", "contractuel": commitment.gravimetry_treatment, "restePhase": 0, "effectif": 0, "resteRealiser": commitment.gravimetry_treatment},
            ]
            serializer = EngagementDetailSerializer(data, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# View for commitments (Step 2 of Perimetres)
class CommitementListView(APIView):
    def get(self, request):
        commitments = Commitement.objects.all()
        
        # Filter by perimeter if provided
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            commitments = commitments.filter(phase__ctr__prm__name=prm_name)
            
        serializer = CommitementSerializer(commitments, many=True)
        return Response(serializer.data)



# map-----------------------------
# New Views for Map Functionality
class SearchAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('query', '')
        if not query:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            type, value = query.split(':')
            type = type.upper()
        except ValueError:
            return Response({'error': 'Invalid query format. Use type:value (e.g., PRM:REGGANE II)'}, status=status.HTTP_400_BAD_REQUEST)

        results = []
        if type == 'PRM':
            concessions = Concession.objects.filter(name__icontains=value)
            results = ConcessionSerializer(concessions, many=True).data
        elif type == 'BLC':
            blocs = Bloc.objects.filter(id__icontains=value)
            results = BlocSerializer(blocs, many=True).data
        elif type == 'WELL':
            wells = Well.objects.filter(sigle__icontains=value)
            results = WellSerializer(wells, many=True).data
        elif type == '2D':
            seismics = Seismic.objects.filter(type='2D', name__icontains=value)
            results = SeismicSerializer(seismics, many=True).data
        elif type == '3D':
            seismics = Seismic.objects.filter(type='3D', name__icontains=value)
            results = SeismicSerializer(seismics, many=True).data
        elif type == 'D':
            departments = Departement.objects.filter(id__icontains=value)
            results = DepartementSerializer(departments, many=True).data
        else:
            return Response({'error': 'Invalid search type'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(results, status=status.HTTP_200_OK)

# Simplified views for map data (removing unnecessary filters for map rendering)
class ConcessionMapView(APIView):
    def get(self, request):
        concessions = Concession.objects.all()
        serializer = ConcessionSerializer(concessions, many=True)
        data = [{'name': item['name'], 'positions': item['positions_display']} for item in serializer.data]
        return Response(data, status=status.HTTP_200_OK)

class BlocMapView(APIView):
    def get(self, request):
        blocs = Bloc.objects.all()
        serializer = BlocSerializer(blocs, many=True)
        data = [{'id': item['id'], 'positions': item['positions_display']} for item in serializer.data]
        return Response(data, status=status.HTTP_200_OK)

class WellMapView(APIView):
    def get(self, request):
        print(f"Request user: {request.user}, authenticated: {request.user.is_authenticated}")
        wells = Well.objects.all()
        serializer = WellSerializer(wells, many=True)
        data = [{'sigle': item['sigle'], 'position': item['position_display']} for item in serializer.data]
        return Response(data, status=status.HTTP_200_OK)

class SeismicMapView(APIView):
    def get(self, request):
        type_filter = request.query_params.get('type', None)
        if type_filter:
            seismics = Seismic.objects.filter(type=type_filter)
        else:
            seismics = Seismic.objects.all()
        serializer = SeismicSerializer(seismics, many=True)
        data = [{'nom_etude': item['nomEtude'], 'positions': item['positions_display']} for item in serializer.data]
        return Response(data, status=status.HTTP_200_OK)

# New View to Save Drawn Polygons
# backend/yourapp/views.py

# @csrf_exempt
# @api_view(['POST'])
class SavePolygonAPIView(APIView):
    def post(self, request):
        print(f"Request headers: {request.headers}")
        print(f"Request data: {request.data}")
        print(f"Request user: {request.user}, authenticated: {request.user.is_authenticated}")
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        entity_type = request.data.get('entity_type')
        if not entity_type:
            return Response({'error': 'Entity type is required'}, status=status.HTTP_400_BAD_REQUEST)

        entity_type = entity_type.upper()
        data = request.data.get('data', {})
        print('Received data:', data)

        try:
            if entity_type == 'WELL':
                position = data.get('position')
                if not position or not isinstance(position, list) or len(position) != 2:
                    return Response({'error': 'Invalid position for WELL'}, status=status.HTTP_400_BAD_REQUEST)
                data['coords'] = Point([position[1], position[0]], srid=4326)
            elif entity_type in ['PRM', 'BLC', '2D', '3D']:
                positions = data.get('positions')
                if not positions or not isinstance(positions, list) or len(positions) < (2 if entity_type == '2D' else 3):
                    return Response({'error': 'Invalid positions for entity'}, status=status.HTTP_400_BAD_REQUEST)
                # Let the serializer handle the geometry conversion
                if entity_type in ['PRM', '2D', '3D']:
                    data['operator'] = request.user.username

            if entity_type == 'PRM':
                serializer = ConcessionSerializer(data=data)
            elif entity_type == 'BLC':
                serializer = BlocSerializer(data=data)
            elif entity_type == 'WELL':
                serializer = WellSerializer(data=data)
            elif entity_type in ['2D', '3D']:
                data['type'] = entity_type
                serializer = SeismicSerializer(data=data)
            else:
                return Response({'error': f'Invalid entity type: {entity_type}'}, status=status.HTTP_400_BAD_REQUEST)

            if serializer.is_valid():
                instance = serializer.save()
                positions = data.get('positions') or data.get('position')
                if not positions:
                    serializer_instance = serializer.__class__(instance)
                    if entity_type == 'WELL':
                        positions = serializer_instance.data.get('position_display', [])
                    else:
                        positions = serializer_instance.data.get('positions_display', [])

                if entity_type == 'PRM':
                    identifier = instance.name
                elif entity_type == 'BLC':
                    identifier = instance.id
                elif entity_type == 'WELL':
                    identifier = instance.sigle
                else:
                    identifier = instance.nom_etude

                TransactionLog.objects.create(
                    user=request.user,
                    model_name=entity_type,
                    object_id=str(instance.pk),
                    action='INSERT',
                    changes={'geometry': str(data.get('coords', '')), 'data': data}
                )

                print('Positions in response:', positions)
                return Response({
                    'status': 'success',
                    'id': identifier,
                    'positions': positions
                }, status=status.HTTP_201_CREATED)
            print('Serializer errors:', serializer.errors)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print('Exception:', str(e))
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# New View to Fetch Subordinates

class SubordinatesAPIView(APIView):

    def get(self, request):

        if not request.user.is_authenticated:

            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)



        try:

            user_profile = UserProfile.objects.get(user=request.user)

            if not user_profile.is_manager:

                return Response({'error': 'User is not a manager'}, status=status.HTTP_403_FORBIDDEN)



            subordinates = UserProfile.objects.filter(manager=request.user)

            subordinates_data = [

                {'username': profile.user.username}

                for profile in subordinates

            ]

            return Response(subordinates_data, status=status.HTTP_200_OK)

        except UserProfile.DoesNotExist:

            return Response({'error': 'UserProfile not found'}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
def auth_status_view(request):
    if request.user.is_authenticated:
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            is_manager = user_profile.is_manager
        except UserProfile.DoesNotExist:
            # If UserProfile doesn't exist, assume user is not a manager
            is_manager = False
        return JsonResponse({
            'is_authenticated': True,
            'username': request.user.username,
            'is_manager': is_manager,
        })
    return JsonResponse({
        'is_authenticated': False,
    })


class AuthStatusView(APIView):
    def get(self, request):
        print(f"AuthStatusView: Request user: {request.user}, authenticated: {request.user.is_authenticated}")
        return Response({
            'is_authenticated': request.user.is_authenticated,
            'username': request.user.username if request.user.is_authenticated else None
        }, status=status.HTTP_200_OK)