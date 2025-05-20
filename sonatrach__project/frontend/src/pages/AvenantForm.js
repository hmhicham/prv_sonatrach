// src/components/AvenantForm.js
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Avenants.css';

function AvenantForm() {
  const [motif, setMotif] = useState('');
  const [step, setStep] = useState(1);
  const [perimeter, setPerimeter] = useState('');
  const [requestNumber, setRequestNumber] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [responseNumber, setResponseNumber] = useState('');
  const [responseDate, setResponseDate] = useState('');
  const [status, setStatus] = useState('');
  const [observation, setObservation] = useState('');
  const [documentDem, setDocumentDem] = useState(null);
  const [documentResp, setDocumentResp] = useState(null);
  const [demFilename, setDemFilename] = useState('');
  const [respFilename, setRespFilename] = useState('');
  const [perimeters, setPerimeters] = useState([]);
  const [phases, setPhases] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState('');
  const [contract, setContract] = useState('');
  const [hasTs, setHasTs] = useState('');
  const [surfaceRendue, setSurfaceRendue] = useState('');
  const navigate = useNavigate();

  const motifsOptions = [
    { value: 'ACP', label: 'Accord de passage de phase' },
    { value: 'ASL', label: 'Adjonction de surfaces libres' },
    { value: 'PSD', label: 'Prorogation de surfaces de découvertes' },
    { value: 'ING', label: 'Integration des niveaux géologiques' },
    { value: 'EPP', label: 'Extension de la période de prorogation' },
    { value: 'ISDL', label: 'Intégration de surfaces de découvertes libres' },
    { value: 'RPTAP', label: "Travaux d'engagement par anticipation" },
    { value: 'EPC', label: 'Extension de la période contractuelle' },
    { value: 'CACRC', label: 'Nouveau contrat R&E ou concession Amont' },
  ];

  useEffect(() => {
    axios
      .get('/api/concessions/')
      .then((response) => {
        const fetchedPerimeters = response.data.map((item) => item.name);
        setPerimeters(fetchedPerimeters);
        if (fetchedPerimeters.length > 0) {
          setPerimeter(fetchedPerimeters[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching perimeters:', error.message);
        setError('Failed to load perimeters.');
      });

    axios
      .get('/api/phases/')
      .then((response) => setPhases(response.data))
      .catch((error) => {
        console.error('Error fetching phases:', error.message);
        setError('Failed to load phases');
      });

    axios
      .get('/api/contracts/')
      .then((response) => setContracts(response.data))
      .catch((error) => {
        console.error('Error fetching contracts:', error.message);
        setError('Failed to load contracts');
      });
  }, []);

  const handleNext = () => {
    if (step === 1 && !perimeter) {
      setError('Please select a perimeter');
      return;
    }
    if (step === 2 && (!motif || !requestNumber || !requestDate || !documentDem || !demFilename || (motif === 'ACP' && !phase))) {
      setError('Please fill all required fields, including the demand document.');
      return;
    }
    if (step < 3) setStep(step + 1);
    setError(null);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    setError(null);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        if (type === 'dem') {
          setDocumentDem(base64String);
          setDemFilename(file.name);
        } else {
          setDocumentResp(base64String);
          setRespFilename(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!motif || !requestNumber || !requestDate || !documentDem || !demFilename || (motif === 'ACP' && (!phase || !surfaceRendue))) {
      setError('Please fill all required fields, including the demand document.');
      return;
    }
  
    const formData = {
      numeroDemande: requestNumber,
      type: motif === 'CACRC' ? 'Av' : 'D',
      has_ts: hasTs === 'true' || hasTs === true,
      accord: status === 'Approuvé' ? true : false,
      dateDemande: requestDate,
      dem_filename: demFilename,
      document_dem_input: documentDem, // Use input field name
      reponse: responseNumber || null,
      dateReponse: responseDate || null,
      resp_filename: respFilename || null,
      document_resp_input: documentResp || null, // Use input field name
      motif: motif,
      phase: motif === 'ACP' ? phase : null,
      ctr: contract || null,
      observation: observation || null,
      surface_rendue: motif === 'ACP' ? parseFloat(surfaceRendue) : null,
    };

    console.log('Form data being submitted:', formData); // Log the data

    try {
      const response = await axios.post('/api/demandes/create/', formData);
      console.log('Demande created:', response.data);
      navigate('/avenants');
      alert('Demande submitted successfully!');
    } catch (error) {
      console.error('Error submittingg demande:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Failed to submit demande.');
    }
  };

  return (
    <div className="requests-container">
      <h1>Ajouter une nouvelle demande</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="stepper">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <span className="step-label">Périmètre</span>
        </div>
        <div className={`step-connector ${step >= 2 ? 'active' : ''}`} />
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <span className="step-label">Demande</span>
        </div>
        <div className={`step-connector ${step >= 3 ? 'active' : ''}`} />
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span className="step-label">Réponse</span>
        </div>
      </div>

      <div className="form-container">
        {step === 1 && (
          <div>
            <h2>Périmètre</h2>
            <div className="form-group">
              <label>Périmètre</label>
              <select value={perimeter} onChange={(e) => setPerimeter(e.target.value)}>
                <option value="">Sélectionner un périmètre</option>
                {perimeters.map((p, index) => (
                  <option key={index} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2>Demande</h2>
            <div className="form-group">
              <label>Motif</label>
              <select value={motif} onChange={(e) => setMotif(e.target.value)}>
                <option value="">Sélectionner un motif</option>
                {motifsOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Numéro de la demande</label>
              <input type="text" value={requestNumber} onChange={(e) => setRequestNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Date d’envoi de la demande</label>
              <input type="date" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Document de la demande (requis)</label>
              <input type="file" onChange={(e) => handleFileChange(e, 'dem')} accept=".pdf,.doc,.docx" />
            </div>
            <div className="form-group">
              <label>
                Inclut des Travaux Supplémentaires (TS)
                <input type="checkbox" checked={hasTs} onChange={(e) => setHasTs(e.target.checked)} />
              </label>
            </div>
            {motif === 'ACP' && (
              <div>
                <div className="form-group">
                  <label>Phase (pour ACP)</label>
                  <select value={phase} onChange={(e) => setPhase(e.target.value)}>
                    <option value="">Sélectionner une phase</option>
                    {phases.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Surface rendue (en m²)</label>
                  <input
                    type="number"
                    value={surfaceRendue}
                    onChange={(e) => setSurfaceRendue(e.target.value)}
                    placeholder="Entrez la surface rendue"
                  />
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Contrat</label>
              <select value={contract} onChange={(e) => setContract(e.target.value)}>
                <option value="">Sélectionner un contrat</option>
                {contracts.map((c) => (
                  <option key={c.num} value={c.num}>{c.num}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2>Réponse</h2>
            <div className="form-group">
              <label>Numéro de la réponse</label>
              <input type="text" value={responseNumber} onChange={(e) => setResponseNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Date de la réponse d’ALNAFT</label>
              <input type="date" value={responseDate} onChange={(e) => setResponseDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Document de la réponse</label>
              <input type="file" onChange={(e) => handleFileChange(e, 'resp')} accept=".pdf,.doc,.docx" />
            </div>
            <div className="form-group">
              <label>Statut ALNAFT</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Sélectionner un statut</option>
                <option value="Approuvé">Approuvé</option>
                <option value="Rejeté">Rejeté</option>
                <option value="En attente">En attente</option>
              </select>
            </div>
            <div className="form-group">
              <label>Observation</label>
              <textarea value={observation} onChange={(e) => setObservation(e.target.value)} rows="4" />
            </div>
          </div>
        )}

        <div className="navigation-buttons">
          <button onClick={handleBack} disabled={step === 1}>Retour</button>
          {step < 3 ? (
            <button onClick={handleNext}>Suivant</button>
          ) : (
            <button onClick={handleSubmit}>Soumettre</button>
          )}
          <button onClick={() => navigate('/avenants')}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default AvenantForm;