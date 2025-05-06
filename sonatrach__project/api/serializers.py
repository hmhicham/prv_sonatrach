# # from rest_framework import serializers
# # from accounts.models import Demande

# # from .models import Concession, Contract, Phase, Seismic, Well, Bassin, Wilaya

# # class WilayaSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Wilaya
# #         fields = '__all__'

# # class BassinSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Bassin
# #         fields = '__all__'

# # class PhaseSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Phase
# #         fields = '__all__'

# # class ContractSerializer(serializers.ModelSerializer):
# #     phases = PhaseSerializer(many=True, read_only=True)
    
# #     class Meta:
# #         model = Contract
# #         fields = '__all__'

# # class ConcessionSerializer(serializers.ModelSerializer):
# #     contracts = ContractSerializer(many=True, read_only=True)
# #     bassins = BassinSerializer(many=True, read_only=True)
# #     wilayas = WilayaSerializer(many=True, read_only=True)
    
# #     class Meta:
# #         model = Concession
# #         fields = '__all__'

# # class SeismicSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Seismic
# #         fields = '__all__'

# # class WellSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Well
# #         fields = '__all__'

# # ----------------------------------------

# # class DemandeSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Demande
# #         fields = '__all__'
# #         read_only_fields = ['document_dem', 'document_resp']

# # ---------------------------------------------------------------------------



# from rest_framework import serializers
# from accounts.models import Demande, Concession, Contract, Phase, Seismic, Well, GgStudies, Fracturation

# class ConcessionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Concession
#         fields = ['name']

# class PhaseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Phase
#         fields = ['id', 'name']

# class ContractSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Contract
#         fields = ['num']

# class DemandeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Demande
#         fields = [
#             'num', 'type', 'has_ts', 'accord', 'date_envoi', 'document_dem',
#             'dem_filename', 'resp_num', 'date_resp', 'resp_filename',
#             'document_resp', 'motif', 'phase', 'ctr'
#         ]
#         read_only_fields = ['accord', 'has_ts']

#     def validate(self, data):
#         if data.get('motif') == 'ACP' and not data.get('phase'):
#             raise serializers.ValidationError("The 'phase' field is required when motif is 'ACP'.")
#         return data

# # programme ---------------#
# class SeismicSerializer(serializers.ModelSerializer):
#     prm = ConcessionSerializer(read_only=True)  # Include the perimeter name

#     class Meta:
#         model = Seismic
#         fields = ['name', 'prm', 'type', 'start_date', 'end_date', 'company', 'operator', 'kilometrage', 'cost', 'offshore', 'data_quality']

# class WellSerializer(serializers.ModelSerializer):
#     prm = ConcessionSerializer(read_only=True)  # Include the perimeter name

#     class Meta:
#         model = Well
#         fields = ['sigle', 'name', 'prm', 'type', 'objective', 'start_date', 'end_date', 'result', 'state', 'cost', 'company', 'offshore']

# class GgStudiesSerializer(serializers.ModelSerializer):
#     prm = ConcessionSerializer(read_only=True)  # Include the perimeter name

#     class Meta:
#         model = GgStudies
#         fields = ['name', 'prm', 'start_date', 'end_date', 'company', 'cost']

# class FracturationSerializer(serializers.ModelSerializer):
#     prm = serializers.SerializerMethodField()  # Fetch prm via phase.ctr.prm
#     well_name = serializers.CharField(source='well.sigle', read_only=True)  # Get well sigle

#     class Meta:
#         model = Fracturation
#         fields = ['name', 'prm', 'start_date', 'end_date', 'company', 'cost', 'init_rate', 'fin_rate', 'reservoirs', 'well_name']

#     def get_prm(self, obj):
#         # Navigate through phase -> ctr -> prm to get the perimeter name
#         if obj.phase and obj.phase.ctr and obj.phase.ctr.prm:
#             return obj.phase.ctr.prm.name
#         return None


# # perimetreLIste ---------------------------------




# ---------------------------------------
from rest_framework import serializers
from django.contrib.gis.geos import Polygon, Point, LineString
import base64
from accounts.models import Demande, Concession, Contract, Phase, Seismic, Well, GgStudies, Fracturation, Commitement, Bloc, Departement


    #for the map
   # backend/yourapp/serializers.py
class BlocSerializer(serializers.ModelSerializer):
    positions = serializers.ListField(
        child=serializers.ListField(
            child=serializers.FloatField(),
            min_length=2,
            max_length=2
        ),
        min_length=3,
        write_only=True,
        required=False
    )
    positions_display = serializers.SerializerMethodField()

    class Meta:
        model = Bloc
        fields = ['id', 'positions', 'positions_display', 'coords']
        read_only_fields = ['positions_display', 'coords']

    def create(self, validated_data):
        print('Validated data in create:', validated_data)
        positions = validated_data.pop('positions', None)
        print('Positions in create:', positions)
        if positions:
            try:
                coords = [[pos[1], pos[0]] for pos in positions]
                if len(coords) < 3:
                    raise serializers.ValidationError("A polygon must have at least 3 points.")
                if coords[0] != coords[-1]:
                    coords.append(coords[0])
                validated_data['coords'] = Polygon(coords, srid=4326)
            except Exception as e:
                print('Error creating Polygon:', str(e))
                raise serializers.ValidationError(f"Invalid coordinates: {str(e)}")
        instance = super().create(validated_data)
        instance.refresh_from_db()
        print('Instance coords after save:', instance.coords)
        return instance

# there is no impact on the map
    # def get_positions(self, obj):
    #     if obj.coords:
    #         print(f"Coords for Bloc {obj.id}:", obj.coords)
    #         coords = obj.coords.coords
    #         print(f"Extracted coords for Bloc {obj.id}:", coords)
    #         return [list(coord)[::-1] for coord in coords[0]]  # Convert [lng, lat] back to [lat, lng]
    #     print(f"No coords for Bloc {obj.id}")
    #     return []

    def update(self, instance, validated_data):
        positions = validated_data.pop('positions', None)
        if positions:
            try:
                coords = [[pos[1], pos[0]] for pos in positions]
                if len(coords) < 3:
                    raise serializers.ValidationError("A polygon must have at least 3 points.")
                if coords[0] != coords[-1]:
                    coords.append(coords[0])
                validated_data['coords'] = Polygon(coords, srid=4326)
            except Exception as e:
                print('Error creating Polygon:', str(e))
                raise serializers.ValidationError(f"Invalid coordinates: {str(e)}")
        return super().update(instance, validated_data)

    def get_positions_display(self, obj):
        if obj.coords:
            print(f"Coords for Bloc {obj.id}:", obj.coords)
            try:
                coords = obj.coords.coords
                print(f"Extracted coords for Bloc {obj.id}:", coords)
                exterior_ring = coords[0] if isinstance(coords, tuple) and len(coords) > 0 else coords
                return [list(coord)[::-1] for coord in exterior_ring]
            except Exception as e:
                print(f"Error extracting positions for Bloc {obj.id}: {str(e)}")
                return []
        print(f"No coords for Bloc {obj.id}")
        return []

class DepartementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departement
        fields = ['id', 'asset']

class ConcessionSerializer(serializers.ModelSerializer):
    validity = serializers.SerializerMethodField()
    blocs = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    linkedPerimeters = serializers.SerializerMethodField()
    observation = serializers.CharField(source='notes', allow_blank=True)
    status = serializers.CharField(allow_null=True)
    positions = serializers.ListField(
        child=serializers.ListField(
            child=serializers.FloatField(),
            min_length=2,
            max_length=2
        ),
        min_length=3,
        write_only=True,
        required=False
    )
    positions_display = serializers.SerializerMethodField(source='positions')
    dept = serializers.PrimaryKeyRelatedField(queryset=Departement.objects.all(), allow_null=True)
    linked_prms = serializers.PrimaryKeyRelatedField(queryset=Concession.objects.all(), many=True, required=False)

    class Meta:
        model = Concession
        fields = ['name', 'validity', 'blocs', 'department', 'status', 'linkedPerimeters', 'observation', 'positions', 'positions_display', 'dept', 'linked_prms']
        read_only_fields = ['positions_display']

    def create(self, validated_data):
        print('Validated data in create:', validated_data)
        positions = validated_data.pop('positions', None)
        print('Positions in create:', positions)
        if positions:
            try:
                coords = [[pos[1], pos[0]] for pos in positions]
                if len(positions) < 3:
                    raise serializers.ValidationError("A polygon must have at least 3 points.")
                if coords[0] != coords[-1]:
                    coords.append(coords[0])
                validated_data['coords'] = MultiPolygon([Polygon(coords, srid=4326)], srid=4326)
            except Exception as e:
                print('Error creating MultiPolygon:', str(e))
                raise serializers.ValidationError(f"Invalid coordinates: {str(e)}")
        instance = super().create(validated_data)
        instance.refresh_from_db()
        print('Instance coords after save:', instance.coords)
        return instance

    def get_positions_display(self, obj):
        if obj.coords:
            print(f"Coords for Concession {obj.name}:", obj.coords)
            coords = obj.coords.coords
            print(f"Extracted coords for Concession {obj.name}:", coords)
            try:
                exterior_ring = coords[0][0] if isinstance(coords, tuple) and len(coords) > 0 else coords
                return [list(coord)[::-1] for coord in exterior_ring]
            except Exception as e:
                print(f"Error extracting positions for Concession {obj.name}: {str(e)}")
                return []
        print(f"No coords for Concession {obj.name}")
        return []

    def get_validity(self, obj):
        contract = obj.contract_prm.first()
        if contract and contract.vig_date and contract.ech_date:
            vig_date = contract.vig_date.strftime('%d/%m/%Y')
            ech_date = contract.ech_date.strftime('%d/%m/%Y')
            return f"Du {vig_date} au {ech_date}"
        return "N/A"

    def get_blocs(self, obj):
        return ", ".join([bloc.id for bloc in obj.blocks.all()])

    def get_department(self, obj):
        return obj.dept.id if obj.dept else "N/A"

    def get_linkedPerimeters(self, obj):
        return ", ".join([prm.name for prm in obj.linked_prms.all()])

class PhaseSerializer(serializers.ModelSerializer):
    surface = serializers.FloatField(source='contract_pct')

    class Meta:
        model = Phase
        fields = ['id', 'name', 'duration', 'surface']

class ContractSerializer(serializers.ModelSerializer):
    perimetre = serializers.CharField(source='prm.name')
    contractNumber = serializers.CharField(source='num')
    signatureDate = serializers.DateField(source='sign_date')
    effectiveDate = serializers.DateField(source='vig_date')
    contractDuration = serializers.SerializerMethodField()
    phases = PhaseSerializer(many=True, source='contract_phs')

    class Meta:
        model = Contract
        fields = ['num', 'perimetre', 'contractNumber', 'signatureDate', 'effectiveDate', 'contractDuration', 'phases']

    def get_contractDuration(self, obj):
        if obj.vig_date and obj.ech_date:
            delta = (obj.ech_date - obj.vig_date).days // 30  # Approximate months
            return delta
        return 0

class CommitementSerializer(serializers.ModelSerializer):
    phase = serializers.CharField(source='phase.name')
    duration = serializers.IntegerField(source='phase.duration')
    surface = serializers.FloatField(source='phase.contract_pct')
    sismique2D = serializers.FloatField(source='s2d_acq')
    sismique3D = serializers.FloatField(source='s3d_acq')
    retraitement2D = serializers.FloatField(source='retraitement_2d')
    retraitement3D = serializers.FloatField(source='retraitement_3d')
    puitsWildcat = serializers.IntegerField(source='well_wc')
    puitsDelineation = serializers.IntegerField(source='well_d')
    puitsAppreciation = serializers.IntegerField(source='well_app')
    tests = serializers.IntegerField(source='well_test')
    etudesG_G = serializers.IntegerField(source='gg_studies')
    acquisitionGravimetrie = serializers.IntegerField(source='gravimetry_acquisition')
    traitementGravimetrie = serializers.IntegerField(source='gravimetry_treatment')

    class Meta:
        model = Commitement
        fields = [
            'id', 'phase', 'duration', 'surface', 'sismique2D', 'sismique3D',
            'retraitement2D', 'retraitement3D', 'puitsWildcat', 'puitsDelineation',
            'puitsAppreciation', 'tests', 'etudesG_G', 'acquisitionGravimetrie',
            'traitementGravimetrie'
        ]

class EngagementDetailSerializer(serializers.Serializer):
    label = serializers.CharField()
    contractuel = serializers.FloatField()
    restePhase = serializers.FloatField()
    effectif = serializers.FloatField()
    resteRealiser = serializers.FloatField()

class DemandeSerializer(serializers.ModelSerializer):
    numeroDemande = serializers.CharField(source='num')
    dateDemande = serializers.DateField(source='date_envoi')
    type = serializers.CharField()
    has_ts = serializers.BooleanField()
    demande = serializers.SerializerMethodField()
    dateReponse = serializers.DateField(source='date_resp', allow_null=True)
    # accordee = serializers.SerializerMethodField()
    accord = serializers.BooleanField()
    dem_filename = serializers.CharField()
    document_dem = serializers.CharField(write_only=True)  # Accept as base64 string
    reponse = serializers.CharField(source='resp_num', allow_null=True)
    motif = serializers.CharField()
    phase = serializers.PrimaryKeyRelatedField(queryset=Phase.objects.all(), allow_null=True, required=False)
    resp_filename = serializers.CharField(allow_null=True)
    document_resp = serializers.CharField(write_only=True)
    ctr = serializers.PrimaryKeyRelatedField(queryset=Contract.objects.all(), required=True)
    

    class Meta:
        model = Demande
        fields = ['numeroDemande', 'type', 'has_ts', 'accord', 'dateDemande', 'dem_filename', 'document_dem',
            'demande', 'dateReponse', 'reponse', 'motif', 'phase', 'resp_filename', 'document_resp', 'ctr']
        read_only_fields = ['accord', 'has_ts']

    def create(self, validated_data):
        # Decode base64 to binary for document_dem
        document_dem_b64 = validated_data.pop('document_dem')
        validated_data['document_dem'] = base64.b64decode(document_dem_b64)
         # Decode base64 to binary for document_resp, if present
        document_resp_b64 = validated_data.pop('document_resp', None)
        if document_resp_b64:
            validated_data['document_resp'] = base64.b64decode(document_resp_b64)
        else:
            validated_data['document_resp'] = None

        return super().create(validated_data)

    def get_demande(self, obj):
        return "Oui" if obj.has_ts else "Non"

    def get_accordee(self, obj):
        return "Oui" if obj.accord else "Non"

    def validate(self, data):
        if data.get('motif') == 'ACP' and not data.get('phase'):
            raise serializers.ValidationError("The 'phase' field is required when motif is 'ACP'.")
        return data

# class SeismicSerializer(serializers.ModelSerializer):
#     designations = serializers.CharField(source='activity', default='Acq')
#     perimetre = serializers.CharField(source='prm.name')
#     nomEtude = serializers.CharField(source='name')
#     dateDebut = serializers.DateField(source='start_date', allow_null=True)
#     dateFin = serializers.DateField(source='end_date', allow_null=True)
#     compagnieService = serializers.CharField(source='company', allow_null=True)
#     kilometrage = serializers.FloatField(allow_null=True)
#     couts = serializers.IntegerField(source='cost', allow_null=True)
#     type = serializers.CharField()  # <-- add this line
#     dataQuality = serializers.CharField(source='data_quality', allow_null=True)  # <-- add this line
#      # Add positions for map rendering
#     positions = serializers.SerializerMethodField()  # Make position read-only and computed
#     prm = serializers.PrimaryKeyRelatedField(queryset=Concession.objects.all(), required=True) 

#     class Meta:
#         model = Seismic
#         fields = ['designations', 'perimetre', 'nomEtude', 'dateDebut', 'dateFin', 'compagnieService', 'kilometrage', 'couts', 'type', 'dataQuality', 'positions', 'prm']
# #for the map
#     def create(self, validated_data):
#         positions = validated_data.pop('positions', None)
#         if positions:
#             coords = [[pos[1], pos[0]] for pos in positions]
#             if validated_data['type'] == '2D':
#                 validated_data['coords'] = LineString(coords, srid=4326)
#             else:  # 3D
#                 if coords[0] != coords[-1]:
#                     coords.append(coords[0])
#                 validated_data['coords'] = Polygon(coords, srid=4326)
#         instance = super().create(validated_data)
#         instance.refresh_from_db()  # Refresh the instance to ensure coords is populated
#         return instance

# # for the map
#     def get_positions(self, obj):
#         if obj.coords:
#             if obj.type == '2D':
#                 coords = obj.coords.coords
#                 return [list(coord)[::-1] for coord in coords]  # LineString: [lat, lng]
#             else:  # 3D
#                 coords = obj.coords.coords
#                 return [list(coord)[::-1] for coord in coords[0]]  # Polygon: [lat, lng]
#         return []


class SeismicSerializer(serializers.ModelSerializer):
    nomEtude = serializers.CharField(source='name', allow_blank=True)  # Fixed source to 'name'
    positions = serializers.ListField(
        child=serializers.ListField(
            child=serializers.FloatField(),
            min_length=2,
            max_length=2
        ),
        min_length=2,
        write_only=True,
        required=False
    )
    positions_display = serializers.SerializerMethodField(source='positions')

    class Meta:
        model = Seismic
        fields = ['nomEtude', 'type', 'positions', 'positions_display','prm', 'name','start_date','end_date','company','cost','kilometrage']
        read_only_fields = ['positions_display']

    def create(self, validated_data):
        print('Validated data in create:', validated_data)
        positions = validated_data.pop('positions', None)
        print('Positions in create:', positions)
        if positions:
            try:
                coords = [[pos[1], pos[0]] for pos in positions]
                if validated_data.get('type') == '3D':
                    if len(positions) < 3:
                        raise serializers.ValidationError("A 3D seismic polygon must have at least 3 points.")
                    if coords[0] != coords[-1]:
                        coords.append(coords[0])
                    validated_data['coords'] = Polygon(coords, srid=4326)
                else:
                    if len(positions) < 2:
                        raise serializers.ValidationError("A 2D seismic line must have at least 2 points.")
                    validated_data['coords'] = LineString(coords, srid=4326)
            except Exception as e:
                print('Error creating geometry:', str(e))
                raise serializers.ValidationError(f"Invalid coordinates: {str(e)}")
        instance = super().create(validated_data)
        instance.refresh_from_db()
        print('Instance coords after save:', instance.coords)
        return instance

    def get_positions_display(self, obj):
        if obj.coords:
            print(f"Coords for Seismic {obj.name}:", obj.coords)
            try:
                coords = obj.coords.coords
                print(f"Extracted coords for Seismic {obj.name}:", coords)
                if obj.type == '3D':
                    exterior_ring = coords[0] if isinstance(coords, tuple) and len(coords) > 0 else coords
                    return [list(coord)[::-1] for coord in exterior_ring]
                else:
                    return [list(coord)[::-1] for coord in coords]
            except Exception as e:
                print(f"Error extracting positions for Seismic {obj.name}: {str(e)}")
                return []
        print(f"No coords for Seismic {obj.name}")
        return []



# class WellSerializer(serializers.ModelSerializer):
#     # prm = ConcessionSerializer(read_only=True)
#     # position = serializers.SerializerMethodField()  # Add position for map rendering

#     prm = serializers.PrimaryKeyRelatedField(queryset=Concession.objects.all(), required=True)
#     position = serializers.SerializerMethodField()  # Make position read-only and computed

#     class Meta:
#         model = Well
#         fields = ['sigle', 'name', 'prm', 'type', 'objective', 'start_date', 'end_date', 'result', 'state', 'cost', 'company', 'offshore', 'position']

#     # for the map
#     def create(self, validated_data):
#         position = validated_data.pop('position', None)
#         if position:
#             # Convert [lat, lng] to [lng, lat] for GeoDjango
#             coords = [position[1], position[0]]
#             validated_data['coords'] = Point(coords, srid=4326)
#         instance = super().create(validated_data)
#         instance.refresh_from_db()  # Refresh the instance to ensure coords is populated
#         return instance

#     # for the map
#     def get_position(self, obj):
#         if obj.coords:
#             coords = obj.coords.coords
#             return list(coords[0])[::-1]  # Reverse [lng, lat] to [lat, lng]
#         return []


# ta3 doka ?
# class WellSerializer(serializers.ModelSerializer):
#     position = serializers.ListField(
#         child=serializers.FloatField(),
#         min_length=2,
#         max_length=2,
#         write_only=True,
#         required=False
#     )
#     position_display = serializers.SerializerMethodField(source='position')

#     class Meta:
#         model = Well
#         fields = ['sigle', 'position', 'position_display']
#         read_only_fields = ['position_display']

#     def create(self, validated_data):
#         print('Validated data in create:', validated_data)
#         position = validated_data.pop('position', None)
#         print('Position in create:', position)
#         if position:
#             try:
#                 validated_data['coords'] = Point(position[1], position[0], srid=4326)  # [lng, lat]
#             except Exception as e:
#                 print('Error creating Point:', str(e))
#                 raise serializers.ValidationError(f"Invalid coordinates: {str(e)}")
#         instance = super().create(validated_data)
#         instance.refresh_from_db()
#         print('Instance coords after save:', instance.coords)
#         return instance

#     def get_position_display(self, obj):
#         if obj.coords:
#             print(f"Coords for Well {obj.sigle}:", obj.coords)
#             coords = obj.coords.coords
#             print(f"Extracted coords for Well {obj.sigle}:", coords)
#             try:
#                 return [coords[1], coords[0]]  # Convert [lng, lat] to [lat, lng]
#             except Exception as e:
#                 print(f"Error extracting position for Well {obj.sigle}: {str(e)}")
#                 return []
#         print(f"No coords for Well {obj.sigle}")
#         return []


class WellSerializer(serializers.ModelSerializer):
    position = serializers.ListField(
        child=serializers.FloatField(),
        min_length=2,
        max_length=2,
        write_only=True,
        required=False
    )
    position_display = serializers.SerializerMethodField(source='position')
    prm = ConcessionSerializer(read_only=True)

    class Meta:
        model = Well
        fields = ['sigle', 'position', 'position_display','prm', 'name','type','objective','start_date','end_date','result','cost','company']
        read_only_fields = ['position_display']

    def create(self, validated_data):
        print('Validated data in create:', validated_data)
        position = validated_data.pop('position', None)
        print('Position in create:', position)
        if position:
            try:
                validated_data['coords'] = Point(position[1], position[0], srid=4326)  # [lng, lat]
            except Exception as e:
                print('Error creating Point:', str(e))
                raise serializers.ValidationError(f"Invalid coordinates: {str(e)}")
        instance = super().create(validated_data)
        instance.refresh_from_db()
        print('Instance coords after save:', instance.coords)
        return instance

    def get_position_display(self, obj):
        if obj.coords:
            print(f"Coords for Well {obj.sigle}:", obj.coords)
            try:
                coords = obj.coords.coords
                print(f"Extracted coords for Well {obj.sigle}:", coords)
                if coords and len(coords) > 0:
                    point = coords[0]  # Take the first point from ((lng, lat),)
                    return [point[1], point[0]]  # Convert [lng, lat] to [lat, lng]
                return []
            except Exception as e:
                print(f"Error extracting position for Well {obj.sigle}: {str(e)}")
                return []
        print(f"No coords for Well {obj.sigle}")
        return []



        

class GgStudiesSerializer(serializers.ModelSerializer):
    prm = ConcessionSerializer(read_only=True)

    class Meta:
        model = GgStudies
        fields = ['name', 'prm', 'start_date', 'end_date', 'company', 'cost']

class FracturationSerializer(serializers.ModelSerializer):
    prm = serializers.SerializerMethodField()
    well_name = serializers.CharField(source='well.sigle', read_only=True)

    class Meta:
        model = Fracturation
        fields = ['name', 'prm', 'start_date', 'end_date', 'company', 'cost', 'init_rate', 'fin_rate', 'reservoirs', 'well_name']

    def get_prm(self, obj):
        if obj.phase and obj.phase.ctr and obj.phase.ctr.prm:
            return obj.phase.ctr.prm.name
        return None


