from decimal import Decimal
from django.db import models
from django.contrib.gis.db import models as gis_models
from django.db.models.constraints import UniqueConstraint
from django.contrib.auth.models import User
from django.forms import ValidationError 

MONTH_CHOICES = [
    ("Janvier", "Jan"),
    ("Février", "Fev"),
    ("Mars", "Mar"),
    ("Avril", "Avr"),
    ("Mai", "Mai"),
    ("Juin", "Juin"),
    ("Juillet", "Juil"),
    ("Août", "Aout"),
    ("Septembre", "Sep"),
    ("Octobre", "Oct"),
    ("Novembre", "Nov"),
    ("Décembre", "Dec"),
]

class Surface(models.Model):
    id = models.CharField(max_length=70, primary_key=True)
    coords = gis_models.GeometryField(null=True)
    type = models.CharField(max_length=15,
                             choices=[('POD', 'POD',),
                                      ('SP', 'Surface prorogée')],
                            default="UNKNOWN")
    carto_area = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    validated_area = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    validated = models.BooleanField()
    
    class Meta:
        db_table = 't_surface'


class Bloc(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    coords = gis_models.GeometryField(null=True)
    class Meta:
        db_table = 't_blocs'


class Wilaya(models.Model):
    code = models.CharField(max_length=2, unique=True)
    name = models.CharField(max_length=30, primary_key=True)
    coords = gis_models.GeometryField(null=True)
    
    class Meta:
        db_table = 't_wilaya'


class Departement(models.Model):
    id = models.CharField(max_length=70, primary_key=True)
    coords = gis_models.GeometryField(null=True)
    asset = models.CharField(max_length=15,
                             choices=[('ASN', 'Asset nord',),
                                      ('ASC', 'Asset centre'),
                                      ('ASO', 'Asset ouest'),
                                      ('ASE', 'Asset est')],
                            default="UNKNOWN")
    class Meta:
        db_table = 't_depts'


class Bassin(models.Model):
    """bassin geologique"""
    id = models.CharField(max_length=100, primary_key=True)
    coords = gis_models.GeometryField(null=True)
    asset = models.CharField(max_length=15,
                             choices=[('ASN', 'Asset nord',),
                                      ('ASC', 'Asset centre'),
                                      ('ASO', 'Asset ouest'),
                                      ('ASE', 'Asset est')],
                            default="UNKNOWN")
    area = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    age_basal = models.CharField(max_length=100, db_comment="L’âge de formation initiale")
    age_sup = models.CharField(max_length=100, db_comment="L’âge le plus récent des dépôts")
    color_hex = models.CharField(max_length=10)
    play = models.CharField()
    plate_loca = models.CharField(db_comment="tectonic plate setting")

    class Meta:
        db_table = 't_bassins'

    def __str__(self):
        return self.name


class Concession(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    classification = models.CharField(max_length=255, null=True,
                                      choices=[('Near field emergeant', 'Near field emergeant',),
                                                ('Near field mature', 'Near field mature'),
                                                ('Frontier emergeant', 'Frontier emergeant'),
                                                ('Frontier mature', 'Frontier mature')]) 
    bassin = models.ManyToManyField(Bassin, null=True, blank=True)
    dept = models.ForeignKey(
        Departement, to_field='id', on_delete=models.CASCADE, related_name='deptconcession', null=True)
    blocks = models.ManyToManyField(Bloc, blank=True)
    init_area = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    distance = models.DecimalField(max_digits=10, decimal_places=2, null=True,
                                   db_comment='distance aux infrastructures et CPF')
    zones_fisc = models.CharField(max_length=25, null=True)
    status = models.CharField(max_length=50,
                              null=True,
                              choices=[('Contrat de recherche', 'Contrat de recherche',),
                                       ('ACPO', 'Acte de Prospection 05.07'),
                                       ('ACPN', 'Acte de Prospection 19.13'),
                                       ('Concession Amont', 'Concession Amont')])
    notes = models.TextField(blank=True, null=True)
    coords = gis_models.MultiPolygonField(srid=4326, null=True)
    linked_prms = models.ManyToManyField('self', blank=True)
    wilaya =  models.ManyToManyField(Wilaya, blank=True)
    operator = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = 't_perimetres'

    def __str__(self):
        return self.name


class Contract(models.Model):
    num = models.CharField(max_length=100, primary_key=True, db_comment='numéro du contrat')
    sign_date = models.DateField(db_comment='date de signature du contrat')
    vig_date = models.DateField(db_comment='date d entrée en vigueur du contrat')
    ech_date = models.DateField(db_comment='date d échéance du contrat')
    situation = models.CharField(choices=[('EC', 'En cours de traitement',),
                                          ('EV', 'En vigueur'),
                                          ('Ec', 'Echu'),
                                          ('Ecs', 'Echu avec surfaces prorogées')],
                                 null=True,
                                 db_comment='situation contractuelle')
    status = models.CharField(choices=[('DAA', 'Déposé attente approbation',),
                                       ('AP', 'Approuvé'),
                                       ('APR', 'Approuvé avec réserves'),
                                       ('ECAP', "En cours d'approbation"),
                                       ('NPL', 'Non approuvé libre'),
                                       ('GE', 'Gisement en exploitation')],
                              null=True,
                              db_comment='statut vis à vis ALNAFT')
    phase_nb = models.IntegerField(db_comment='nombre de phases')
    prm = models.ForeignKey(
        Concession, to_field='name', on_delete=models.CASCADE, related_name='contract_prm', unique=True
    )
    
    class Meta:
        db_table = 't_contracts'
        constraints = [UniqueConstraint(fields=['num', 'prm'],
                                         name='unique_ctr')]

    def __str__(self):
        return self.num


class Phase(models.Model):
    name = models.CharField(choices=[('Phase 1', 'Phase 1'), ('Phase 2', 'Phase 2'),
                                     ('Phase 3', 'Phase 3')])
    ctr = models.ForeignKey(
        Contract, to_field='num', on_delete=models.CASCADE, related_name='contract_phs'
    )
    duration = models.SmallIntegerField()
    start_date = models.DateField(db_comment='date de début de phase')
    end_date = models.DateField(db_comment='date accord de passage de phase EL NAFT')
    contract_pct = models.DecimalField(max_digits=5, decimal_places=2, default=30.00, db_comment='pourcentage contractuel de la superficie rendue')
    actual_pct = models.DecimalField(max_digits=10, decimal_places=2, null=True, db_comment='pourcentage réel de la superficie rendue')
    surface_rendu = gis_models.MultiPolygonField(srid=4326, null=True, db_comment="represente la surface rendue à la fin de la phase")
    rem_2d = models.IntegerField(default=0)
    rem_3d = models.IntegerField(default=0)
    rem_wc = models.SmallIntegerField(default=0)
    rem_d = models.SmallIntegerField(default=0)
    rem_gg = models.SmallIntegerField(default=0)
    
    class Meta:
        db_table = 't_phases'
        constraints = [UniqueConstraint(fields=['name', 'ctr'],
                                         name='unique_phases')]


class Seismic(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    start_date = models.DateField(db_comment='date de début de réalisation', null=True)
    end_date = models.DateField(null=True, blank=True, db_comment='date de fin de réalisation')
    company = models.CharField(max_length=30, null=True, db_comment='les réalisateurs')
    operator = models.CharField(max_length=30, null=True)
    kilometrage = models.FloatField(null=True)
    cost = models.PositiveIntegerField(default=0)
    type =  models.CharField(choices=[('2D', 'Etude sismique 2D'), ('3D', 'Etude sismique 3D')])
    activity = models.CharField(choices=[('Acq', 'Acquisition'), ('Tr', 'Traitement'), ('Retr', 'Retraitement')], default='Acq') 
    coords = gis_models.GeometryField(null=True)
    datum =  models.CharField(max_length=100, null=True)
    ellipsoid = models.CharField(max_length=100, null=True)
    notes = models.TextField(blank=True)
    phase = models.ForeignKey(Phase, to_field='id', on_delete=models.CASCADE, null=True)
    wilaya = models.ManyToManyField(Wilaya, null=True)
    offshore = models.BooleanField(default=False)
    data_quality = models.CharField(max_length=30, null=True)
    prm = models.ForeignKey(
        Concession, to_field='name', on_delete=models.CASCADE, related_name='realisations', default='test_7654'
    )
    
    class Meta:
        db_table = 't_sis_realisation'

    def __str__(self):
        return self.name
    
    def clean(self):
        """Ensure the right geometry type is provided based on the type of study."""
        from django.core.exceptions import ValidationError
        if self.type == '2D' and not isinstance(self.coords, models.LineString):
            raise ValidationError('For 2D studies, coords must be a LineString.')
        if self.type == '3D' and not isinstance(self.coords, models.Polygon):
            raise ValidationError('For 3D studies, coords must be a Polygon.')


class SeismicLine(models.Model):
    """ 2D Seismic Line """
    id = models.CharField(max_length=40, primary_key=True)
    seismic_program = models.ForeignKey(Seismic, on_delete=models.CASCADE, related_name='lines')
    coords = gis_models.LineStringField()
    
    def __str__(self):
        return f"Line for {self.seismic_program.name}"


class SeismicActivityReport(models.Model):
    study =  models.ForeignKey(
        Seismic, to_field='name', on_delete=models.CASCADE, related_name='sis_report'
    )
    report_date = models.DateField()
    kilometers = models.DecimalField(max_digits=10, decimal_places=2)
    seismic_points = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Report for {self.report_date}"


class GgStudies(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    start_date = models.DateField(db_comment='date de début de réalisation')
    end_date = models.DateField(db_comment='date de fin de réalisation')
    phase = models.ForeignKey(Phase, to_field='id', on_delete=models.CASCADE, null=True)
    company = models.CharField(max_length=30)
    cost = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    prm = models.ForeignKey(
        Concession, to_field='name', on_delete=models.CASCADE, related_name='realisations_gg'
    )
    
    class Meta:
        db_table = 't_gg_realisation'

    def __str__(self):
        return self.name


class Well(models.Model):
    sigle = models.CharField(max_length=30, primary_key=True)
    name =  models.CharField(max_length=100, unique=True, null=True)
    coords = gis_models.MultiPointField(srid=4326, null=True)
    total_depth = models.FloatField(null=True)
    zsol = models.PositiveIntegerField(null=True)
    rig = models.CharField(null=True)
    type =  models.CharField(choices=[('W', "Puits d'exploration"),
                                      ('D', 'Puits de délinéation'),
                                      ('Dev', 'Puits de développement'),
                                      ('S', 'Statigraphique')], null=True)
    state = models.CharField(choices=[('BE', "Branché en exploitation"),
                                      ('CB', 'Complété et Branché'),
                                      ('CFP', 'Complété en Fermeture Provisoire'),
                                      ('AP', 'Abondon Provisoire'),
                                      ('AD', 'Abondon définitif')], blank=True, null=True)
    start_date = models.DateField(db_comment='date de début de réalisation', null=True)
    end_date = models.DateField(null=True, blank=True, db_comment='date de fin de réalisation')
    phase = models.ForeignKey(Phase, to_field='id', on_delete=models.CASCADE, null=True)
    objective = models.CharField(max_length=500, null=True)
    result = models.CharField(choices=[('+', "Positif"),
                                      ('-', 'Négatif'),
                                      ('Dec', 'Découverte')],
                              null=True,
                              blank=True)
    offshore = models.BooleanField(default=False)
    cost = models.FloatField(null=True)
    client = models.CharField(max_length=30, null=True, default="Sonatrach")
    company = models.CharField(max_length=30, null=True, db_comment="entreprise de forage")
    notes = models.TextField(blank=True, null=True)
    npt = models.SmallIntegerField(default=0, db_comment='Non productive time en jours')
    prm = models.ForeignKey(
        Concession, to_field='name', on_delete=models.CASCADE, related_name='puits', null=True
    )
    
    class Meta:
        db_table = 't_Well'

    def __str__(self):
        return self.sigle


class WellReservoirFluid(models.Model):
    well = models.ForeignKey(Well, on_delete=models.CASCADE, to_field="sigle")
    fluid = models.CharField(choices=[('H', "Huile"),
                                      ('G', 'Gaz'),
                                      ('C', 'Condensat'),
                                      ('GA', 'Gaz associé')])
    reservoir = models.CharField()
    reservoir_unit = models.CharField(max_length=50, help_text="Reservoir formation (e.g., Devonien F6, C3)")
    discovery_year = models.SmallIntegerField()
    status = models.CharField(
        max_length=10,
        choices=[
            ('D', "Découverte"),
            ('MHC', "Mise en évidence D'HC")
        ]
    )
    nature = models.CharField(
        max_length=50,
        choices=[
            ("DT", "Délinéations & travaux"),
            ("TP", "Transfert proposé"),
            ("NT", "Non transférable"),
            ("T", "Transférable"),
            ("D", "Découverte"),
            ("DL", "Délinéations"),
            ("A", "Additif")
        ])
    
    class Meta:
        db_table = 'well_reservoir'
        unique_together = ('well', 'fluid')
        verbose_name = "Well reservoir "
        verbose_name_plural = "Well reservoir "

    def __str__(self):
        return f"{self.well.name} - {self.fluid} - {self.reservoir}"


class ReserveEstimation(models.Model):
    well_fluid_reservoir = models.ForeignKey(WellReservoirFluid, on_delete=models.CASCADE, related_name="estimations")
    
    proved = models.FloatField(help_text="Proved reserves (P1)")
    probable = models.FloatField(help_text="Probable reserves (P2)")
    possible = models.FloatField(help_text="Possible reserves (P3)")
    estimation_date = models.DateTimeField(auto_now_add=True, help_text="Date of estimation")
    estimator = models.CharField(max_length=100, help_text="Person or department responsible for estimation")
    comments = models.TextField(blank=True, null=True, help_text="Additional details about the estimation")

    class Meta:
        db_table = 'well_reservoir_vol'
        verbose_name = "Well reservoir vol "
        verbose_name_plural = "Well reservoir vol"

    def __str__(self):
        return f"{self.well.name} - {self.fluid} - {self.reservoir}"


class Fracturation(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    start_date = models.DateField(db_comment='date de début de réalisation')
    end_date = models.DateField(db_comment='date de fin de réalisation')
    phase = models.ForeignKey(Phase, to_field='id', on_delete=models.CASCADE, null=True)
    company = models.CharField(max_length=30)
    cost = models.PositiveIntegerField(default=0)
    init_rate =  models.PositiveIntegerField(default=0, db_comment='débit initial')
    fin_rate = models.PositiveIntegerField(default=0, db_comment='débit final')
    reservoirs = models.CharField(max_length=30, null=True)
    well = models.ForeignKey(
        Well, to_field='sigle', on_delete=models.CASCADE, related_name='frac'
    )
    
    class Meta:
        db_table = 't_frac'

    def __str__(self):
        return self.name


class Commitement(models.Model):
    id = models.BigAutoField(primary_key=True)
    phase =  models.ForeignKey(
        Phase, to_field='id', on_delete=models.CASCADE, related_name='engagementphs'
    )
    type_commit = models.CharField(max_length=10,
                              choices=[('EI', 'Engagement initial'),
                                       ('TS', 'Travaux sup')],
                              default='EI',
                              db_comment="type de l'engagement")
    
    s2d_acq = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'), db_comment='Km')
    s3d_acq = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'), db_comment='Km2')
    well_d = models.PositiveIntegerField(db_comment='nombre de puits délin', default=0)
    well_wc = models.PositiveIntegerField(db_comment='nombre de puits wildcut', default=0)
    well_app = models.PositiveIntegerField(db_comment='nombre de puits d appréciation', default=0)
    well_test = models.PositiveIntegerField(db_comment='nombre de puits à tester', default=0)
    gg_studies = models.PositiveIntegerField(db_comment='nombre etude G&G', default=0)
    workover = models.PositiveIntegerField(db_comment='nombre WO', default=0)
    frac_acid = models.PositiveIntegerField(db_comment='fracturation et acidification (Nombre puits) ', default=0)
    gravimetry_acquisition = models.PositiveIntegerField(default=0)
    gravimetry_treatment = models.PositiveIntegerField(default=0) 
    retraitement_2d = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    retraitement_3d = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))

    # Costs for each activity
    cost_s2d_acq = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_s3d_acq = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_well_d = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_well_wc = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_well_app = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_well_tst = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_gg_studies = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_gravimetry_acquisition = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_gravimetry_treatment = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_wo = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, db_comment='cout workover')
    cost_frac_acid = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_retraitement_2d = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cost_retraitement_3d = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    
    
    class Meta:
        db_table = 't_commitement'
        unique_together = ('phase', 'type_commit')

    def __str__(self):
        return self.id


class Demande(models.Model):
    num = models.CharField(primary_key=True)
    type = models.CharField(choices=[('Av', "Avenant"), ('D', 'Demande')], default='Demande')
    has_ts = models.BooleanField(default=False, db_comment='la demande de passage de phase inclut des TS')
    accord = models.BooleanField(default=False, db_comment='la demande a été accordée')
    date_envoi = models.DateField()
    document_dem = models.BinaryField()  # Keep NOT NULL as it seems required
    dem_filename = models.CharField(max_length=255)
    resp_num = models.CharField(max_length=255, null=True, blank=True)  # Allow NULL
    date_resp = models.DateField(null=True, blank=True)
    resp_filename = models.CharField(max_length=255, null=True, blank=True)  # Allow NULL
    document_resp = models.BinaryField(null=True, blank=True)  # Allow NULL
    motif = models.CharField(choices=[
        ('ACP', 'Accord de passage de phase'),
        ('ASL', 'Adjonction de surfaces libres'),
        ('PSD', 'Prorogation de surfaces de découvertes'),
        ('ING', 'Integration des niveaux géologiques'),
        ('EPP', 'Extension de la période de prorogation'),
        ('ISDL', 'Intégration de surfaces de découvertes libres'),
        ('RPTAP', "Réalisation physique de travaux d'engagement par anticipation sur une phase"),
        ('EPC', "Extension de la période contractuelle"),
        ('CACRC', "Conclusion d'accord d'un nouveau contrat R&E ou d'une concession Amont")
    ])
    phase = models.ForeignKey(
        Phase, to_field='id', on_delete=models.CASCADE, related_name='demande_phs', null=True
    )
    ctr = models.ForeignKey(
        Contract, to_field='num', on_delete=models.CASCADE, related_name='demande_ctr', null=True
    )

    class Meta:
        db_table = 't_demande'
    
    def clean(self):
        if self.motif == 'ACP' and self.phase is None:
            raise ValidationError("The 'phase' field cannot be null when 'motif' is set to 'ACP'.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

# use'r change
class CtrStatusLog(models.Model):
    id = models.BigAutoField(primary_key=True)
    ctr = models.ForeignKey(
        Contract, to_field='num', on_delete=models.CASCADE, related_name='ctr', null=True
    )
    previous_status = models.CharField(null=True)
    new_status = models.CharField()
    changed_by =  models.ForeignKey(User, on_delete=models.CASCADE, to_field='username', db_column='changed_by_id')
    changed_at =  models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.contract.title} status changed by {self.changed_by.username} on {self.changed_at}'

    class Meta:
        db_table = 't_ctrlogs'


class ToRealise(models.Model):
    s2d = models.PositiveIntegerField(db_comment='kilometrage 2D')
    s3d = models.PositiveIntegerField(db_comment='kilometrage 3D')
    well_d = models.PositiveIntegerField(db_comment='nombre de puits délin')
    well_wc = models.PositiveIntegerField(db_comment='nombre de puits wildcut')
    gg_studies = models.PositiveIntegerField(db_comment='nombre etude G&G', default=0)
    phs = models.ForeignKey(
        Phase, to_field='id', on_delete=models.CASCADE, related_name='phsrr'
    )

# use'r change
class Notification(models.Model):
    msg = models.CharField()
    read = models.BooleanField(default=False)
    target = models.ManyToManyField(User)
    category = models.CharField(max_length=15,
                                choices=[('PP', 'Passage de phase',),
                                         ('EXPCTR', 'Expiration de contrat'),
                                         ('AUTH', 'Expiration du mot de passe')],
                                default="UNKNOWN")
    date = models.DateTimeField(auto_now_add=True)
    deadline = models.PositiveIntegerField(db_comment='nombre de jours avant event', default=0)

    class Meta:
        db_table = 't_notifications'


class PMT(models.Model):
    """Programme à moyen Terme"""
    prm = models.ForeignKey(
        Concession, to_field='name', on_delete=models.CASCADE, related_name='prmpmt'
    )
    year = models.PositiveSmallIntegerField()
    measure = models.CharField(
        max_length=100,
        choices=[
            ('wildcat_forés', 'Nombre de puits Forés - Wildcat'),
            ('delineation_forés', 'Nombre de puits Forés - Délinéation'),
            ('wildcat_terminés', 'Nombre de puits Terminés - Wildcat'),
            ('delineation_terminés', 'Nombre de puits Terminés - Délinéation'),
            ('métrage', 'Métrage'),
            ('mois_appareils', 'Mois-appareils'),
            ('mois_equipes_2d', 'Mois-équipes 2D'),
            ('points_vibrés_2d', 'Points vibrés 2D'),
            ('km_profil_2d', 'Km-profil 2D'),
            ('traitement_2d', 'Traitement 2D'),
            ('retraitement_2d', 'Retraitement 2D'),
            ('mois_equipes_3d', 'Mois-équipes 3D'),
            ('points_vibrés_3d', 'Points vibrés 3D'),
            ('km2_profil_3d', 'Km²-profil 3D'),
            ('traitement_3d', 'Traitement 3D'),
            ('retraitement_3d', 'Retraitement 3D'),
            ('geologie_terrain', 'Géologie de terrain (mois-ingénieurs)'),
            ('travaux_synthese', 'Travaux de synthèse (mois-ingénieurs)'),
            ('gravimetrie', 'Gravimétrie (mois-ingénieurs)'),
            ('aero_magnetometrie', 'Aero-magnetometrie (Km)'),
            ('frac_work_over', 'Fracturation + work over'),
            ('core_drill', 'Core drilling'),
        ],
        db_comment="This field represents the activity-related measure."
    )

    value = models.PositiveBigIntegerField(default=None)
    
    class Meta:
        db_table = 'pmt'
        unique_together = ('prm', 'year', 'measure')


class SeisMonthlyPrevisions(models.Model):
    """Prévisions mensuelles des activités sismiques"""
    sisProg = models.ForeignKey(
        Seismic, to_field='name', on_delete=models.CASCADE, related_name='sisprevisions'
    )
    month = models.SmallIntegerField(null=False)
    year = models.PositiveSmallIntegerField(null=False)
    pv = models.BigIntegerField(default=0)
    meq = models.FloatField(default=0.0)
    kilometrage_prev = models.BigIntegerField(default=0)
    cost_sci = models.BigIntegerField(default=0, db_comment="cout valorisé en KDA SCI")
    cost_ci = models.BigIntegerField(default=0, db_comment="cout valorisé en KDA avec CI")

    class Meta:
        db_table = 'sisPrevisions'
        unique_together = ('sisProg', 'year', 'month')


class DrillMonthlyPrevisions(models.Model):
    """Prévisions mensuelles du forage"""
    wellProg = models.ForeignKey(
        Well, to_field='sigle', on_delete=models.CASCADE, related_name='wellprevisions'
    )
    month = models.SmallIntegerField(null=False)
    year = models.PositiveSmallIntegerField()
    metrage = models.FloatField(default=0.0)
    mapp = models.FloatField(default=0.0)
    cost = models.FloatField(default=0.0)    

    class Meta:
        db_table = 'wellPrevisions'
        unique_together = ('wellProg', 'year', 'month')


class InstallationSurface(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    sigle = models.CharField(max_length=25, unique=True, blank=True)
    coords = models.CharField(max_length=255, null=True)
    objective = models.CharField(max_length=100, choices=[
        ('separation', 'Separation Unit'),
        ('compression', 'Compression Station'),
        ('storage', 'Storage Facility'),
        ('pipeline', 'Pipeline Network'),
        ('flare', 'Flare System'),
    ], blank=True)
    type = models.CharField(max_length=100, blank=True)
    fluid = models.CharField(max_length=100, choices=[
        ('Gaz', 'Gaz'),
        ('Huile', 'Huile')
    ], blank=True)
    capacity = models.FloatField(help_text="Capacity in barrels or cubic meters", null=True)
    company = models.CharField(max_length=100, blank=True, db_comment="société de réalisation")
    commissioning_date = models.SmallIntegerField(null=True, db_comment='année de mise en service')
    status = models.CharField(max_length=50, choices=[
        ('EN SERVICE,', 'EN SERVICE'),
        ('HORS SERVICE', 'HORS SERVICE')
    ], default='active',  null=True)

    def __str__(self):
        return f"{self.name} ({self.type})"
    
    class Meta:
        db_table = 'installationSurface'


class Manifold(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    coords = models.CharField(max_length=255)
    installation = models.ForeignKey(InstallationSurface, on_delete=models.CASCADE, related_name="manifolds")
    type = models.CharField(max_length=50)
    number_of_inputs = models.IntegerField(help_text="Number of input wells")
    number_of_outputs = models.IntegerField(help_text="Number of output pipelines")
    max_pressure = models.FloatField(help_text="Maximum operating pressure in bar or psi")
    commissioning_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.type})"
    
    class Meta:
        db_table = 'manifold'

# use'r change
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')

    def __str__(self):
        return self.user.username
    
    @property
    def is_manager(self):
        return self.user.groups.filter(name='Manager').exists()

# use'r change
class TransactionLog(models.Model):
    """Logging of changes to the database"""
    ACTION_CHOICES = [
        ('INSERT', 'Insert'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete')
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    model_name = models.CharField(max_length=255)
    object_id = models.CharField(max_length=255, null=True, blank=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    changes = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.user} {self.action} {self.model_name} {self.object_id} at {self.timestamp}"
    
    class Meta:
        db_table = 'transaction_log'
        

