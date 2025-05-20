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
from accounts.models import Concession, Demande, Phase, Contract, Seismic, Well, GgStudies, Fracturation, Commitement,Bloc,Departement, TransactionLog, UserProfile, SeisMonthlyPrevisions,DrillMonthlyPrevisions,PMT
from .serializers import (
    ConcessionSerializer, DemandeSerializer, PhaseSerializer, ContractSerializer, 
    SeismicSerializer, WellSerializer, GgStudiesSerializer, FracturationSerializer, CommitementSerializer, BlocSerializer, DepartementSerializer, SeisMonthlyPrevisionsSerializer,DrillMonthlyPrevisionsSerializer,

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
from django.contrib.auth.models import User
import traceback


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

        print(f"Query params: {request.query_params}")
        names_only = 'names_only' in request.query_params
        print(f"names_only: {names_only}")
        # Filtering for PerimeterList page
        search_term = request.query_params.get('search', None)
        dept_asset = request.query_params.get('dept__asset', None)
        status_filter = request.query_params.get('status', None)
        # Debugging


        if search_term:
            concessions = concessions.filter(name__icontains=search_term)
        if dept_asset:
            concessions = concessions.filter(dept__asset=dept_asset)
        if status_filter:
            concessions = concessions.filter(status=status_filter)
# for the planning pmt page 
        if names_only:
            concessions = concessions.filter(name__isnull=False).values_list('name', flat=True).distinct()
            print(f"Returning nambbbbbbbbbbbbbesb: {list(concessions)}")  # Debug print
            return Response(list(concessions), status=status.HTTP_200_OK)
        

        serializer = ConcessionSerializer(concessions, many=True)
        return Response(serializer.data)

    # def put(self, request, name):
    #     try:
    #         concession = Concession.objects.get(name=name)
    #     except Concession.DoesNotExist:
    #         return Response({"error": "Concession not found"}, status=status.HTTP_404_NOT_FOUND)

    #     serializer = ConcessionSerializer(concession, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, name):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        print(f"Updating concession with name: {name}")
        print(f"Request data: {request.data}")
        try:
            concession = Concession.objects.get(name=name)
        except Concession.DoesNotExist:
            return Response({"error": "Concession not found"}, status=status.HTTP_404_NOT_FOUND)
        print("Received data:", request.data)  # Log incoming data
        serializer = ConcessionSerializer(concession, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Capture the original data before updating
            old_data = ConcessionSerializer(concession).data
            serializer.save()
            updated_concession = Concession.objects.get(name=name)  # Fetch again to confirm
            print(f"Notes after update: {updated_concession.notes}")
            updated_data = serializer.data
            # return Response(serializer.data)
            # Log the update action to TransactionLog
            TransactionLog.objects.create(
                user=request.user,
                model_name='Concession',
                object_id=str(name),  # Use the name as the identifier
                action='UPDATE',
                changes={
                    'old_data': old_data,
                    'new_data': updated_data,
                    'last_modified_by': request.user.username
                }
            )
            return Response(updated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, name):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            concession = Concession.objects.get(name=name)
            # Capture the data before deletion
            data_before_deletion = ConcessionSerializer(concession).data
            concession.delete()
            # concession.delete()
            # Log the delete action to TransactionLog
            TransactionLog.objects.create(
                user=request.user,
                model_name='Concession',
                object_id=str(name),
                action='DELETE',
                changes={
                    'data_before_deletion': data_before_deletion,
                    'deleted_by': request.user.username
                }
            )
            TransactionLog.objects.create(
                user=request.user,
                model_name='Concession',
                object_id=str(name),
                action='DELETE',
                changes={'data_before_deletion': data_before_deletion, 'deleted_by': request.user.username}
            )
            print(f"Logged deletion of Concession {name} by {request.user.username}")
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
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            contracts = contracts.filter(prm__name=prm_name)
        try:
            serializer = ContractSerializer(contracts, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error serializing contracts: {str(e)}")
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DemandeListView(APIView):
    def get(self, request):
        demandes = Demande.objects.all()
        
        # Filter by perimeter if provided
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            demandes = demandes.filter(ctr__prm__name=prm_name)
            
        serializer = DemandeSerializer(demandes, many=True)
        return Response(serializer.data)

# class DemandeCreateView(APIView):
#     def post(self, request):
#         if not request.user.is_authenticated:
#             return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
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
        
#         serializer = DemandeSerializer(data=data, context={'request': request})
#         if serializer.is_valid():
#             instance = serializer.save()
#             # Log the creation in TransactionLog
#             TransactionLog.objects.create(
#                 user=request.user,
#                 model_name='Demande',
#                 object_id=str(instance.num),
#                 action='INSERT',
#                 changes={
#                     'data': data,
#                     'created_by': request.user.username,
#                     'last_modified_by': request.user.username
#                 }
#             )
#             return Response({
#                 'status': 'success',
#                 'num': instance.num,
#                 'created_by': request.user.username,
#                 'last_modified_by': request.user.username
#             }, status=status.HTTP_201_CREATED)
#         return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class DemandeCreateView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data.copy()
        
        # Ensure the correct fields are used
        if 'document_dem_input' in data and data['document_dem_input']:
            file_data = data['document_dem_input']
            if ';base64,' in file_data:
                format, filestr = file_data.split(';base64,')
                ext = format.split('/')[-1]
                data['document_dem_input'] = filestr  # Pass only the base64 part
            else:
                data['document_dem_input'] = file_data  # Handle plain base64

        if 'document_resp_input' in data and data['document_resp_input']:
            file_data = data['document_resp_input']
            if ';base64,' in file_data:
                format, filestr = file_data.split(';base64,')
                ext = format.split('/')[-1]
                data['document_resp_input'] = filestr  # Pass only the base64 part
            else:
                data['document_resp_input'] = file_data  # Handle plain base64

        serializer = DemandeSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            instance = serializer.save()
            TransactionLog.objects.create(
                user=request.user,
                model_name='Demande',
                object_id=str(instance.num),
                action='INSERT',
                changes={
                    'data': data,
                    'created_by': request.user.username,
                    'last_modified_by': request.user.username
                }
            )
            return Response({
                'status': 'success',
                'num': instance.num,
                'created_by': request.user.username,
                'last_modified_by': request.user.username
            }, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
# for testing the planning forage :


# class WellListView(APIView):
#     def get(self, request):
#         wells = Well.objects.all()
        
#         # Filter by perimeter if provided
#         prm_name = request.query_params.get('prm', None)
#         if prm_name:
#             wells = wells.filter(prm__name=prm_name)
            
#         serializer = WellSerializer(wells, many=True)
#         return Response(serializer.data)

# the test :
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from accounts.models import Concession, Demande, Phase, Contract, Seismic, Well, GgStudies, Fracturation, Commitement,Bloc,Departement, TransactionLog, UserProfile, SeisMonthlyPrevisions
from .serializers import (
    ConcessionSerializer, DemandeSerializer, PhaseSerializer, ContractSerializer, 
    SeismicSerializer, WellSerializer, GgStudiesSerializer, FracturationSerializer, CommitementSerializer, BlocSerializer, DepartementSerializer, SeisMonthlyPrevisionsSerializer,DrillMonthlyPrevisionsSerializer

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
from django.contrib.auth.models import User
import traceback


# Custom serializer for engagement details (Step 3 of Perimetres)
class EngagementDetailSerializer(serializers.Serializer):
    label = serializers.CharField()
    contractuel = serializers.FloatField()
    restePhase = serializers.FloatField()
    effectif = serializers.FloatField()
    resteRealiser = serializers.FloatField()

# class ConcessionListView(APIView):
#     def get(self, request):
#         concessions = Concession.objects.all()
        
#         # Filtering for PerimeterList page
#         search_term = request.query_params.get('search', None)
#         dept_asset = request.query_params.get('dept__asset', None)
#         status_filter = request.query_params.get('status', None)

#         if search_term:
#             concessions = concessions.filter(name__icontains=search_term)
#         if dept_asset:
#             concessions = concessions.filter(dept__asset=dept_asset)
#         if status_filter:
#             concessions = concessions.filter(status=status_filter)

#         serializer = ConcessionSerializer(concessions, many=True)
#         return Response(serializer.data)

    # def put(self, request, name):
    #     try:
    #         concession = Concession.objects.get(name=name)
    #     except Concession.DoesNotExist:
    #         return Response({"error": "Concession not found"}, status=status.HTTP_404_NOT_FOUND)

    #     serializer = ConcessionSerializer(concession, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, name):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        print(f"Updating concession with name: {name}")
        print(f"Request data: {request.data}")
        try:
            concession = Concession.objects.get(name=name)
        except Concession.DoesNotExist:
            return Response({"error": "Concession not found"}, status=status.HTTP_404_NOT_FOUND)
        print("Received data:", request.data)  # Log incoming data
        serializer = ConcessionSerializer(concession, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Capture the original data before updating
            old_data = ConcessionSerializer(concession).data
            serializer.save()
            updated_concession = Concession.objects.get(name=name)  # Fetch again to confirm
            print(f"Notes after update: {updated_concession.notes}")
            updated_data = serializer.data
            # return Response(serializer.data)
            # Log the update action to TransactionLog
            TransactionLog.objects.create(
                user=request.user,
                model_name='Concession',
                object_id=str(name),  # Use the name as the identifier
                action='UPDATE',
                changes={
                    'old_data': old_data,
                    'new_data': updated_data,
                    'last_modified_by': request.user.username
                }
            )
            return Response(updated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, name):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            concession = Concession.objects.get(name=name)
            # Capture the data before deletion
            data_before_deletion = ConcessionSerializer(concession).data
            concession.delete()
            # concession.delete()
            # Log the delete action to TransactionLog
            TransactionLog.objects.create(
                user=request.user,
                model_name='Concession',
                object_id=str(name),
                action='DELETE',
                changes={
                    'data_before_deletion': data_before_deletion,
                    'deleted_by': request.user.username
                }
            )
            TransactionLog.objects.create(
                user=request.user,
                model_name='Concession',
                object_id=str(name),
                action='DELETE',
                changes={'data_before_deletion': data_before_deletion, 'deleted_by': request.user.username}
            )
            print(f"Logged deletion of Concession {name} by {request.user.username}")
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
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            contracts = contracts.filter(prm__name=prm_name)
        try:
            serializer = ContractSerializer(contracts, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error serializing contracts: {str(e)}")
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DemandeListView(APIView):
    def get(self, request):
        demandes = Demande.objects.all()
        
        # Filter by perimeter if provided
        prm_name = request.query_params.get('prm', None)
        if prm_name:
            demandes = demandes.filter(ctr__prm__name=prm_name)
            
        serializer = DemandeSerializer(demandes, many=True)
        return Response(serializer.data)

# class DemandeCreateView(APIView):
#     def post(self, request):
#         if not request.user.is_authenticated:
#             return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
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
        
#         serializer = DemandeSerializer(data=data, context={'request': request})
#         if serializer.is_valid():
#             instance = serializer.save()
#             # Log the creation in TransactionLog
#             TransactionLog.objects.create(
#                 user=request.user,
#                 model_name='Demande',
#                 object_id=str(instance.num),
#                 action='INSERT',
#                 changes={
#                     'data': data,
#                     'created_by': request.user.username,
#                     'last_modified_by': request.user.username
#                 }
#             )
#             return Response({
#                 'status': 'success',
#                 'num': instance.num,
#                 'created_by': request.user.username,
#                 'last_modified_by': request.user.username
#             }, status=status.HTTP_201_CREATED)
#         return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class DemandeCreateView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data.copy()
        
        # Ensure the correct fields are used
        if 'document_dem_input' in data and data['document_dem_input']:
            file_data = data['document_dem_input']
            if ';base64,' in file_data:
                format, filestr = file_data.split(';base64,')
                ext = format.split('/')[-1]
                data['document_dem_input'] = filestr  # Pass only the base64 part
            else:
                data['document_dem_input'] = file_data  # Handle plain base64

        if 'document_resp_input' in data and data['document_resp_input']:
            file_data = data['document_resp_input']
            if ';base64,' in file_data:
                format, filestr = file_data.split(';base64,')
                ext = format.split('/')[-1]
                data['document_resp_input'] = filestr  # Pass only the base64 part
            else:
                data['document_resp_input'] = file_data  # Handle plain base64

        serializer = DemandeSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            instance = serializer.save()
            TransactionLog.objects.create(
                user=request.user,
                model_name='Demande',
                object_id=str(instance.num),
                action='INSERT',
                changes={
                    'data': data,
                    'created_by': request.user.username,
                    'last_modified_by': request.user.username
                }
            )
            return Response({
                'status': 'success',
                'num': instance.num,
                'created_by': request.user.username,
                'last_modified_by': request.user.username
            }, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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

    def put(self, request, name):
        try:
            seismic = Seismic.objects.get(name=name)
        except Seismic.DoesNotExist:
            return Response({"error": "Seismic not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SeismicSerializer(seismic, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, name):
        try:
            seismic = Seismic.objects.get(name=name)
        except Seismic.DoesNotExist:
            return Response({"error": "Seismic not found"}, status=status.HTTP_404_NOT_FOUND)
        
        seismic.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class WellListView(APIView):
    def get(self, request):
        try:
            wells = Well.objects.filter(name__isnull=False).values_list('name', flat=True).distinct()
            return Response(list(wells), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
# class ConcessionMapView(APIView):
#     def get(self, request):
#         concessions = Concession.objects.all()
#         serializer = ConcessionSerializer(concessions, many=True)
#         data = [{'name': item['name'], 'positions': item['positions_display']} for item in serializer.data]
#         return Response(data, status=status.HTTP_200_OK)

class BlocMapView(APIView):
    def get(self, request):
        blocs = Bloc.objects.all()
        serializer = BlocSerializer(blocs, many=True)
        data = [{'id': item['id'], 'positions': item['positions_display']} for item in serializer.data]
        for item in serializer.data:
            bloc_id = item['id']
            # Fetch the latest creation log for this bloc
            log = TransactionLog.objects.filter(model_name='BLC', object_id=bloc_id, action='INSERT').order_by('-timestamp').first()
            created_by = log.changes.get('created_by', 'Unknown') if log else 'Unknown'
            data.append({
                'id': item['id'],
                'positions': item['positions_display'],
                'created_by': created_by
            })
        return Response(data, status=status.HTTP_200_OK)
        # return Response(data, status=status.HTTP_200_OK)

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
                    changes={'geometry': str(data.get('coords', '')), 'data': data, 'created_by': request.user.username}
                    
                )

                print('Positions in response:', positions)
                return Response({
                    'status': 'success',
                    'id': identifier,
                    'positions': positions,
                    'created_by': request.user.username
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


class PolygonDetailView(APIView):
    def get(self, request, identifier):
        try:
            if identifier.isdigit():  # Handle bloc IDs
                bloc = Bloc.objects.get(id=identifier)
                serializer = BlocSerializer(bloc)
                return Response(serializer.data)
            else:  # Handle concession names or seismic study names
                try:
                    concession = Concession.objects.get(name=identifier)
                    serializer = ConcessionSerializer(concession)
                    return Response(serializer.data)
                except Concession.DoesNotExist:
                    seismic = Seismic.objects.get(name=identifier)
                    serializer = SeismicSerializer(seismic)
                    return Response(serializer.data)
        except (Bloc.DoesNotExist, Concession.DoesNotExist, Seismic.DoesNotExist) as e:
            return Response({'error': f'{identifier} not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# double
class DepartementListView(APIView):
    def get(self, request):
        departments = Departement.objects.all()
        print(f"Fetched departments: {[dept.id for dept in departments]}")  # Debug log
        serializer = DepartementSerializer(departments, many=True)
        return Response(serializer.data)


# planning sismique
# ... (previous imports and views)

class SeismicForecastView(APIView):
    def get(self, request, sisProg):
        print(f"Received sisProg: {sisProg}")  # Debug log
        try:
            year = 2025
            sisProg = sisProg.replace('%20', ' ')  # Decode URL-encoded space
            forecasts = SeisMonthlyPrevisions.objects.filter(sisProg__name=sisProg, year=year)
            if not forecasts.exists():
                months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec']
                default_data = {
                    'm-eq': {month: 0 for month in months},
                    'Kilometrage': {month: 0 for month in months},
                    'PV': {month: 0 for month in months},
                    'KDA SCI': {month: 0 for month in months},
                    'KDA avec CI': {month: 0 for month in months}
                }
                return Response(default_data, status=status.HTTP_200_OK)

            serializer = SeisMonthlyPrevisionsSerializer(forecasts[0], context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()  # Detailed error logging
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            print("Received data:", request.data)
            project_id = request.data.get('projectId')
            forecast_data = request.data.get('data')
            year = 2025

            if not project_id or not forecast_data:
                return Response(
                    {'error': 'projectId and data are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                seismic_program = Seismic.objects.get(name=project_id)
            except Seismic.DoesNotExist:
                return Response(
                    {'error': f'Seismic program {project_id} not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # Track if any field change qualifies as an UPDATE
            has_update = False

            # Process each month
            for month_name, pv in forecast_data.get('PV', {}).items():
                try:
                    month_num = {
                        'Jan': 1, 'Fev': 2, 'Mar': 3, 'Avr': 4, 'Mai': 5, 'Juin': 6,
                        'Juil': 7, 'Aout': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
                    }.get(month_name)
                    
                    if not month_num:
                        continue

                    # Fetch the existing record for this month
                    existing_forecast = SeisMonthlyPrevisions.objects.filter(
                        sisProg=seismic_program,
                        year=year,
                        month=month_num
                    ).first()

                    # Get the new values from the request
                    new_pv = forecast_data.get('PV', {}).get(month_name, 0)
                    new_meq = forecast_data.get('m-eq', {}).get(month_name, 0)
                    new_kilometrage_prev = forecast_data.get('Kilometrage', {}).get(month_name, 0)
                    new_cost_sci = forecast_data.get('KDA SCI', {}).get(month_name, 0)
                    new_cost_ci = forecast_data.get('KDA avec CI', {}).get(month_name, 0)

                    # Get the existing values (default to 0 if no record exists)
                    old_pv = existing_forecast.pv if existing_forecast else 0
                    old_meq = existing_forecast.meq if existing_forecast else 0
                    old_kilometrage_prev = existing_forecast.kilometrage_prev if existing_forecast else 0
                    old_cost_sci = existing_forecast.cost_sci if existing_forecast else 0
                    old_cost_ci = existing_forecast.cost_ci if existing_forecast else 0

                    # Check each field for changes and determine if it's an INSERT or UPDATE
                    if new_pv != old_pv:
                        if old_pv != 0:
                            has_update = True
                    if new_meq != old_meq:
                        if old_meq != 0:
                            has_update = True
                    if new_kilometrage_prev != old_kilometrage_prev:
                        if old_kilometrage_prev != 0:
                            has_update = True
                    if new_cost_sci != old_cost_sci:
                        if old_cost_sci != 0:
                            has_update = True
                    if new_cost_ci != old_cost_ci:
                        if old_cost_ci != 0:
                            has_update = True

                    # Save the new data
                    forecast, created = SeisMonthlyPrevisions.objects.update_or_create(
                        sisProg=seismic_program,
                        year=year,
                        month=month_num,
                        defaults={
                            'pv': new_pv,
                            'meq': new_meq,
                            'kilometrage_prev': new_kilometrage_prev,
                            'cost_sci': new_cost_sci,
                            'cost_ci': new_cost_ci
                        }
                    )
                    
                except Exception as e:
                    print(f"Error processing month {month_name}:", str(e))
                    continue

            # Log the action in TransactionLog
            action = 'UPDATE' if has_update else 'INSERT'
            print(f"Logging action: {action}")  # Debug log to confirm action
            TransactionLog.objects.create(
                user=request.user,
                model_name='SeisMonthlyPrevisions',
                object_id=str(project_id),
                action=action,
                changes={
                    'data': request.data,
                    'created_by': request.user.username,
                    'last_modified_by': request.user.username
                }
            )

            return Response(
                {'message': 'Forecast data saved successfully'}, 
                status=status.HTTP_200_OK
            )

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'An error occurred: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# planning forage
class DrillingForecastView(APIView):
    def get(self, request, well_name):
        print(f"Received well_name: {well_name}")
        try:
            year = 2025
            well_name = well_name.replace('%20', ' ')
            well = Well.objects.get(name=well_name)
            forecasts = DrillMonthlyPrevisions.objects.filter(wellProg=well, year=year)
            if not forecasts.exists():
                months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
                default_data = {
                    'metrage': {month: 0 for month in months},
                    'M-app': {month: 0 for month in months},
                    'MDA': {month: 0 for month in months}
                }
                return Response(default_data, status=status.HTTP_200_OK)

            serializer = DrillMonthlyPrevisionsSerializer(forecasts[0], context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Well.DoesNotExist:
            return Response({'error': f'Well {well_name} not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            print("Received data:", request.data)
            project_id = request.data.get('projectId')
            forecast_data = request.data.get('data')
            year = 2025

            if not project_id or not forecast_data:
                return Response(
                    {'error': 'projectId and data are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                well = Well.objects.get(name=project_id)
            except Well.DoesNotExist:
                return Response(
                    {'error': f'Well {project_id} not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Track if any field change qualifies as an UPDATE
            has_update = False

            # Process each month
            for month_name, metrage in forecast_data.get('metrage', {}).items():
                try:
                    month_num = {
                        'Jan': 1, 'Fév': 2, 'Mar': 3, 'Avr': 4, 'Mai': 5, 'Juin': 6,
                        'Juil': 7, 'Août': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Déc': 12
                    }.get(month_name)
                    
                    if not month_num:
                        continue

                    # Fetch the existing record for this month
                    existing_forecast = DrillMonthlyPrevisions.objects.filter(
                        wellProg=well,
                        year=year,
                        month=month_num
                    ).first()

                    # Get the new values from the request
                    new_metrage = float(forecast_data.get('metrage', {}).get(month_name, 0))
                    new_mapp = float(forecast_data.get('M-app', {}).get(month_name, 0))
                    new_cost = float(forecast_data.get('MDA', {}).get(month_name, 0))

                    # Get the existing values (default to 0 if no record exists)
                    old_metrage = float(existing_forecast.metrage) if existing_forecast else 0.0
                    old_mapp = float(existing_forecast.mapp) if existing_forecast else 0.0
                    old_cost = float(existing_forecast.cost) if existing_forecast else 0.0

                    # Check each field for changes and determine if it's an INSERT or UPDATE
                    if new_metrage != old_metrage:
                        if old_metrage != 0:
                            has_update = True
                    if new_mapp != old_mapp:
                        if old_mapp != 0:
                            has_update = True
                    if new_cost != old_cost:
                        if old_cost != 0:
                            has_update = True

                    # Save the new data
                    DrillMonthlyPrevisions.objects.update_or_create(
                        wellProg=well,
                        year=year,
                        month=month_num,
                        defaults={
                            'metrage': new_metrage,
                            'mapp': new_mapp,
                            'cost': new_cost
                        }
                    )
                    
                except Exception as e:
                    print(f"Error processing month {month_name}:", str(e))
                    continue

            # Log the action in TransactionLog
            action = 'UPDATE' if has_update else 'INSERT'
            print(f"Logging action: {action}")
            TransactionLog.objects.create(
                user=request.user,
                model_name='DrillMonthlyPrevisions',
                object_id=str(project_id),
                action=action,
                changes={
                    'data': request.data,
                    'created_by': request.user.username,
                    'last_modified_by': request.user.username
                }
            )

            return Response(
                {'message': 'Forecast data saved successfully'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            traceback.print_exc()
            return Response(
                {'error': f'An error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



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
        for item in serializer.data:
            bloc_id = item['id']
            # Fetch the latest creation log for this bloc
            log = TransactionLog.objects.filter(model_name='BLC', object_id=bloc_id, action='INSERT').order_by('-timestamp').first()
            created_by = log.changes.get('created_by', 'Unknown') if log else 'Unknown'
            data.append({
                'id': item['id'],
                'positions': item['positions_display'],
                'created_by': created_by
            })
        return Response(data, status=status.HTTP_200_OK)
        # return Response(data, status=status.HTTP_200_OK)

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
                    changes={'geometry': str(data.get('coords', '')), 'data': data, 'created_by': request.user.username}
                    
                )

                print('Positions in response:', positions)
                return Response({
                    'status': 'success',
                    'id': identifier,
                    'positions': positions,
                    'created_by': request.user.username
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


class PolygonDetailView(APIView):
    def get(self, request, identifier):
        try:
            if identifier.isdigit():  # Handle bloc IDs
                bloc = Bloc.objects.get(id=identifier)
                serializer = BlocSerializer(bloc)
                return Response(serializer.data)
            else:  # Handle concession names or seismic study names
                try:
                    concession = Concession.objects.get(name=identifier)
                    serializer = ConcessionSerializer(concession)
                    return Response(serializer.data)
                except Concession.DoesNotExist:
                    seismic = Seismic.objects.get(name=identifier)
                    serializer = SeismicSerializer(seismic)
                    return Response(serializer.data)
        except (Bloc.DoesNotExist, Concession.DoesNotExist, Seismic.DoesNotExist) as e:
            return Response({'error': f'{identifier} not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DepartementListView(APIView):
    def get(self, request):
        departments = Departement.objects.all()
        print(f"Fetched departments: {[dept.id for dept in departments]}")  # Debug log
        serializer = DepartementSerializer(departments, many=True)
        return Response(serializer.data)


# planning sismique
# ... (previous imports and views)

class SeismicForecastView(APIView):
    def get(self, request, sisProg):
        print(f"Received sisProg: {sisProg}")  # Debug log
        try:
            year = 2025
            sisProg = sisProg.replace('%20', ' ')  # Decode URL-encoded space
            forecasts = SeisMonthlyPrevisions.objects.filter(sisProg__name=sisProg, year=year)
            if not forecasts.exists():
                months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec']
                default_data = {
                    'm-eq': {month: 0 for month in months},
                    'Kilometrage': {month: 0 for month in months},
                    'PV': {month: 0 for month in months},
                    'KDA SCI': {month: 0 for month in months},
                    'KDA avec CI': {month: 0 for month in months}
                }
                return Response(default_data, status=status.HTTP_200_OK)

            serializer = SeisMonthlyPrevisionsSerializer(forecasts[0], context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()  # Detailed error logging
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            print("Received data:", request.data)
            project_id = request.data.get('projectId')
            forecast_data = request.data.get('data')
            year = 2025

            if not project_id or not forecast_data:
                return Response(
                    {'error': 'projectId and data are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                seismic_program = Seismic.objects.get(name=project_id)
            except Seismic.DoesNotExist:
                return Response(
                    {'error': f'Seismic program {project_id} not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # Track if any field change qualifies as an UPDATE
            has_update = False

            # Process each month
            for month_name, pv in forecast_data.get('PV', {}).items():
                try:
                    month_num = {
                        'Jan': 1, 'Fev': 2, 'Mar': 3, 'Avr': 4, 'Mai': 5, 'Juin': 6,
                        'Juil': 7, 'Aout': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
                    }.get(month_name)
                    
                    if not month_num:
                        continue

                    # Fetch the existing record for this month
                    existing_forecast = SeisMonthlyPrevisions.objects.filter(
                        sisProg=seismic_program,
                        year=year,
                        month=month_num
                    ).first()

                    # Get the new values from the request
                    new_pv = forecast_data.get('PV', {}).get(month_name, 0)
                    new_meq = forecast_data.get('m-eq', {}).get(month_name, 0)
                    new_kilometrage_prev = forecast_data.get('Kilometrage', {}).get(month_name, 0)
                    new_cost_sci = forecast_data.get('KDA SCI', {}).get(month_name, 0)
                    new_cost_ci = forecast_data.get('KDA avec CI', {}).get(month_name, 0)

                    # Get the existing values (default to 0 if no record exists)
                    old_pv = existing_forecast.pv if existing_forecast else 0
                    old_meq = existing_forecast.meq if existing_forecast else 0
                    old_kilometrage_prev = existing_forecast.kilometrage_prev if existing_forecast else 0
                    old_cost_sci = existing_forecast.cost_sci if existing_forecast else 0
                    old_cost_ci = existing_forecast.cost_ci if existing_forecast else 0

                    # Check each field for changes and determine if it's an INSERT or UPDATE
                    if new_pv != old_pv:
                        if old_pv != 0:
                            has_update = True
                    if new_meq != old_meq:
                        if old_meq != 0:
                            has_update = True
                    if new_kilometrage_prev != old_kilometrage_prev:
                        if old_kilometrage_prev != 0:
                            has_update = True
                    if new_cost_sci != old_cost_sci:
                        if old_cost_sci != 0:
                            has_update = True
                    if new_cost_ci != old_cost_ci:
                        if old_cost_ci != 0:
                            has_update = True

                    # Save the new data
                    forecast, created = SeisMonthlyPrevisions.objects.update_or_create(
                        sisProg=seismic_program,
                        year=year,
                        month=month_num,
                        defaults={
                            'pv': new_pv,
                            'meq': new_meq,
                            'kilometrage_prev': new_kilometrage_prev,
                            'cost_sci': new_cost_sci,
                            'cost_ci': new_cost_ci
                        }
                    )
                    
                except Exception as e:
                    print(f"Error processing month {month_name}:", str(e))
                    continue

            # Log the action in TransactionLog
            action = 'UPDATE' if has_update else 'INSERT'
            print(f"Logging action: {action}")  # Debug log to confirm action
            TransactionLog.objects.create(
                user=request.user,
                model_name='SeisMonthlyPrevisions',
                object_id=str(project_id),
                action=action,
                changes={
                    'data': request.data,
                    'created_by': request.user.username,
                    'last_modified_by': request.user.username
                }
            )

            return Response(
                {'message': 'Forecast data saved successfully'}, 
                status=status.HTTP_200_OK
            )

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'An error occurred: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# planning forage
class DrillingForecastView(APIView):
    def get(self, request, well_name):
        print(f"Received well_name: {well_name}")
        try:
            year = 2025
            well_name = well_name.replace('%20', ' ')
            well = Well.objects.get(name=well_name)
            forecasts = DrillMonthlyPrevisions.objects.filter(wellProg=well, year=year)
            if not forecasts.exists():
                months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
                default_data = {
                    'metrage': {month: 0 for month in months},
                    'M-app': {month: 0 for month in months},
                    'MDA': {month: 0 for month in months}
                }
                return Response(default_data, status=status.HTTP_200_OK)

            serializer = DrillMonthlyPrevisionsSerializer(forecasts[0], context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Well.DoesNotExist:
            return Response({'error': f'Well {well_name} not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, well_name):  # Add well_name parameter
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            print("Received data:", request.data)
            project_id = request.data.get('projectId')
            forecast_data = request.data.get('data')
            year = 2025

            if not project_id or not forecast_data:
                return Response(
                    {'error': 'projectId and data are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                well = Well.objects.get(name=project_id)
            except Well.DoesNotExist:
                return Response(
                    {'error': f'Well {project_id} not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Track if any field change qualifies as an UPDATE
            has_update = False

            # Process each month
            for month_name, metrage in forecast_data.get('metrage', {}).items():
                try:
                    month_num = {
                        'Jan': 1, 'Fév': 2, 'Mar': 3, 'Avr': 4, 'Mai': 5, 'Juin': 6,
                        'Juil': 7, 'Août': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Déc': 12
                    }.get(month_name)
                    
                    if not month_num:
                        continue

                    # Fetch the existing record for this month
                    existing_forecast = DrillMonthlyPrevisions.objects.filter(
                        wellProg=well,
                        year=year,
                        month=month_num
                    ).first()

                    # Get the new values from the request
                    new_metrage = float(forecast_data.get('metrage', {}).get(month_name, 0))
                    new_mapp = float(forecast_data.get('M-app', {}).get(month_name, 0))
                    new_cost = float(forecast_data.get('MDA', {}).get(month_name, 0))

                    # Get the existing values (default to 0 if no record exists)
                    old_metrage = float(existing_forecast.metrage) if existing_forecast else 0.0
                    old_mapp = float(existing_forecast.mapp) if existing_forecast else 0.0
                    old_cost = float(existing_forecast.cost) if existing_forecast else 0.0

                    # Check each field for changes and determine if it's an INSERT or UPDATE
                    if new_metrage != old_metrage:
                        if old_metrage != 0:
                            has_update = True
                    if new_mapp != old_mapp:
                        if old_mapp != 0:
                            has_update = True
                    if new_cost != old_cost:
                        if old_cost != 0:
                            has_update = True

                    # Save the new data
                    DrillMonthlyPrevisions.objects.update_or_create(
                        wellProg=well,
                        year=year,
                        month=month_num,
                        defaults={
                            'metrage': new_metrage,
                            'mapp': new_mapp,
                            'cost': new_cost
                        }
                    )
                    
                except Exception as e:
                    print(f"Error processing month {month_name}:", str(e))
                    continue

            # Log the action in TransactionLog
            action = 'UPDATE' if has_update else 'INSERT'
            print(f"Logging action: {action}")
            TransactionLog.objects.create(
                user=request.user,
                model_name='DrillMonthlyPrevisions',
                object_id=str(project_id),
                action=action,
                changes={
                    'data': request.data,
                    'created_by': request.user.username,
                    'last_modified_by': request.user.username
                }
            )

            return Response(
                {'message': 'Forecast data saved successfully'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            traceback.print_exc()
            return Response(
                {'error': f'An error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# planning pmt
# accounts/views.py

class ExplorationForecastView(APIView):
    def get(self, request, perimeter_name):
        print(f"Received perimeter_name: {perimeter_name}")
        try:
            perimeter_name = perimeter_name.replace('%20', ' ')
            perimeter = Concession.objects.get(name=perimeter_name)
            forecasts = PMT.objects.filter(prm=perimeter)
            years = ['2025', '2026', '2027', '2028', '2029', '2030']

            # Get all possible measures from the PMT model's choices
            measure_choices = dict(PMT._meta.get_field('measure').choices)
            measure_keys = list(measure_choices.keys())

            # Initialize default data for all measures
            if not forecasts.exists():
                default_data = {}
                for measure in measure_keys:
                    default_data[measure] = {}
                    for year in years:
                        default_data[measure][year] = 0
                return Response(default_data, status=status.HTTP_200_OK)

            # Serialize existing data
            data = {}
            for measure in measure_keys:
                data[measure] = {}
                for year in years:
                    forecast = forecasts.filter(measure=measure, year=int(year)).first()
                    data[measure][year] = forecast.value if forecast else 0

            return Response(data, status=status.HTTP_200_OK)
        except Concession.DoesNotExist:
            return Response({'error': f'Perimeter {perimeter_name} not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, perimeter_name):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            print("Received data:", request.data)
            perimeter_id = request.data.get('perimeterId')
            forecast_data = request.data.get('data')

            if not perimeter_id or not forecast_data:
                return Response(
                    {'error': 'perimeterId and data are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                perimeter = Concession.objects.get(name=perimeter_id)
            except Concession.DoesNotExist:
                return Response(
                    {'error': f'Perimeter {perimeter_id} not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            has_update = False
            for measure_key, yearly_data in forecast_data.items():
                for year, value in yearly_data.items():
                    existing_forecast = PMT.objects.filter(
                        prm=perimeter,
                        year=int(year),
                        measure=measure_key
                    ).first()

                    old_value = float(existing_forecast.value) if existing_forecast else 0.0
                    new_value = float(value)

                    if new_value != old_value and old_value != 0:
                        has_update = True

                    PMT.objects.update_or_create(
                        prm=perimeter,
                        year=int(year),
                        measure=measure_key,
                        defaults={'value': new_value}
                    )

            action = 'UPDATE' if has_update else 'INSERT'
            print(f"Logging action: {action}")
            TransactionLog.objects.create(
                user=request.user,
                model_name='PMT',
                object_id=str(perimeter_id),
                action=action,
                changes={
                    'data': request.data,
                    'created_by': request.user.username,
                    'last_modified_by': request.user.username
                }
            )

            return Response(
                {'message': 'Forecast data saved successfully'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            traceback.print_exc()
            return Response(
                {'error': f'An error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )