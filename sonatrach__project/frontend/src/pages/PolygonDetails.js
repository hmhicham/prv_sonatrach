// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// function PolygonDetails() {
//   const { id } = useParams();
//   const [details, setDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         console.log('Fetching details for ID:', id);
//         const response = await axios.get(`http://127.0.0.1:8000/api/map/polygon-details/${id}/`, { withCredentials: true });
//         console.log('Response data:', response.data);
//         setDetails(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Fetch error:', err.response?.data || err.message);
//         setError('Failed to fetch details');
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [id]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;
//   if (!details) return <div>No details found</div>;

  

//   const getContractData = async (prmName) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/contracts/?prm=${prmName}`, { withCredentials: true });
//     console.log('contract data:', response.data);
//     return response.data[0] || {};
//   };

//   const getPhaseData = async (contractNum) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/phases/?prm=${details.name}`, { withCredentials: true });
//     console.log('phase data:', response.data);
//     return response.data || [];
//   };

//   const getCommitmentData = async (prmName, phaseName) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/commitments/?prm=${prmName}&phase=${phaseName}`, { withCredentials: true });
//     console.log('commitment data:', response.data);
//     return response.data[0] || {};
//   };

//   const renderDetails = () => {
//     let contract = {};
//     let phases = [];
//     let commitment = {};
//     if (details.name) {
//       contract =  getContractData(details.name);
//       phases = getPhaseData(details.name);
//       commitment =  getCommitmentData(details.name, phases[0]?.name);
//     }

//     return (
//       <div>
//         <h1>Polygon Details for {details.name || details.id || details.sigle || details.nom_etude}</h1>
//         {/* <img src="https://via.placeholder.com/300x200.png?text=Polygon+Map" alt="Polygon Map" style={{ maxWidth: '100%' }} /> */}
//         <div>
//           <h2>Informations Générales</h2>
//           <p>Name: {details.name || details.id || details.sigle || details.nom_etude}</p>
//           <p>Status: {details.status || 'N/A'}</p>
//           <p>Notes: {details.notes || 'N/A'}</p>
//         </div>
//         <div>
//           <h2>Cadre Contractuel</h2>
//           <p>N° de contrat: {getContractData.num || 'N/A'}</p>
//           <p>Date de signature du contrat: {contract.sign_date || 'N/A'}</p>
//           <p>Date d'Entrée en vigueur du contrat: {contract.vig_date || 'N/A'}</p>
//           <p>Date d'échéance du contrat: {contract.ech_date || 'N/A'}</p>
//           <p>Période de recherche actuelle: {contract.vig_date && contract.ech_date ? `${contract.vig_date} au ${contract.ech_date}` : 'N/A'}</p>
//           <p>Date de accordée de passage de phase: {phases[0]?.end_date || 'N/A'}</p>
//           {/* <p>Phase 1: {phases.find(p => p.name === 'Phase 1')?.duration || 'N/A'}</p>
//           <p>Phase 2: {phases.find(p => p.name === 'Phase 2')?.duration || 'N/A'}</p>
//           <p>Phase 3: {phases.find(p => p.name === 'Phase 3')?.duration || 'N/A'}</p> */}
//           <p>Phase actuelle du contrat: {phases[0]?.name || 'N/A'}</p>
//         </div>
//         <div>
//           <h2>Système Pétrolier</h2>
//           <p>Roche mère: N/A</p>
//           <p>Réservoir: N/A</p>
//           <p>Couverture: N/A</p>
//           <p>Piège: N/A</p>
//         </div>
//         <div>
//           <h2>Engagements</h2>
//           <p>Nombre de puits: {commitment.well_wc + commitment.well_d + commitment.well_app || 'N/A'}</p>
//           <p>Sismique 2D: {commitment.s2d_acq || 'N/A'}</p>
//           <p>Sismique 3D: {commitment.s3d_acq || 'N/A'}</p>
//         </div>
//         <p>test</p>
//       </div>
//     );
//   };

//   return <div>{renderDetails()}</div>;
// }

// export default PolygonDetails;




// ---------------------------------------------




// import { useParams } from 'react-router-dom';


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function PolygonDetails() {
//   const {id } = useParams()
//   const [details, setDetails] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [phases, setPhases] = useState([]);
//   const [commitment, setCommitment] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         const detailsRes = await axios.get(`http://127.0.0.1:8000/api/map/polygon-details/${id}/`, { withCredentials: true });
//         setDetails(detailsRes.data);
  
//         if (detailsRes.data.name) {
//           let contractData = {};
//           let phasesData = [];
//           let commitmentData = {};
  
//           try {
//             const contractRes = await axios.get(`http://127.0.0.1:8000/api/contracts/?prm=${detailsRes.data.name}`, { withCredentials: true });
//             contractData = contractRes.data[0] || {};
//           } catch (e) {
//             contractData = {};
//           }
//           setContract(contractData);
  
//           try {
//             const phasesRes = await axios.get(`http://127.0.0.1:8000/api/phases/?prm=${detailsRes.data.name}`, { withCredentials: true });
//             phasesData = phasesRes.data || [];
//           } catch (e) {
//             phasesData = [];
//           }
//           setPhases(phasesData);
  
//           if (phasesData.length > 0) {
//             try {
//               const commitmentRes = await axios.get(
//                 `http://127.0.0.1:8000/api/commitments/?prm=${detailsRes.data.name}&phase=${phasesData[0].name}`,
//                 { withCredentials: true }
//               );
//               commitmentData = commitmentRes.data[0] || {};
//             } catch (e) {
//               commitmentData = {};
//             }
//           }
//           setCommitment(commitmentData);
//         }
//       } catch (err) {
//         setDetails(null);
//       }
//       setLoading(false);
//     };
//     fetchAll();
//   }, [id]);

//   if (loading || !details) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>Polygon Details for {details.name || details.id}</h1>
//       <div>
//         <h2>Informations Générales</h2>
//         <p>Name: {details.name || details.id}</p>
//         <p>Status: {details.status || "N/A"}</p>
//         <p>Notes: {details.notes || "N/A"}</p>
//       </div>
//       <div>
//         <h2>Cadre Contractuel</h2>
//         <p>N° de contrat: {contract?.num || "N/A"}</p>
//         <p>Date de signature du contrat: {contract?.signatureDate || "N/A"}</p>
//         <p>Date d'Entrée en vigueur du contrat: {contract?.effectiveDate || "N/A"}</p>
//         <p>Date d'échéance du contrat: {contract?.ech_date || "N/A"}</p>
//         <p>Période de recherche actuelle: {details.validity || "N/A"}</p>
//         <p>Date de accordée de passage de phase: {phases[0]?.end_date || "N/A"}</p>
//         <p>Phase actuelle du contrat: {phases[0]?.name || "N/A"}</p>
//       </div>
//       <div>
//         <h2>Système Pétrolier</h2>
//         <p>Roche mère: N/A</p>
//         <p>Réservoir: N/A</p>
//         <p>Couverture: N/A</p>
//         <p>Piège: N/A</p>
//       </div>
//       <div>
//         <h2>Engagements</h2>
//         <p>
//           Nombre de puits:{" "}
//           {commitment
//             ? (commitment.well_wc || 0) +
//               (commitment.well_d || 0) +
//               (commitment.well_app || 0)
//             : "N/A"}
//         </p>
//         <p>Sismique 2D: {commitment?.s2d_acq || "N/A"}</p>
//         <p>Sismique 3D: {commitment?.s3d_acq || "N/A"}</p>
//       </div>
//     </div>
//   );
// }

// export default PolygonDetails;






import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PolygonDetails.css';

function PolygonDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState({});
  const [phases, setPhases] = useState([]);
  const [commitment, setCommitment] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/map/polygon-details/${id}/`, { withCredentials: true });
        console.log('Polygon details:', response.data);
        setDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement.');
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (!details) return;
    const fetchAll = async () => {
      try {
        const contractData = await axios.get(`http://127.0.0.1:8000/api/contracts/?prm=${details.name}`, { withCredentials: true });
        console.log('Contract data:', contractData.data);
        setContract(contractData.data[0] || {});
        const phaseData = await axios.get(`http://127.0.0.1:8000/api/phases/?prm=${details.name}`, { withCredentials: true });
        console.log('phase data:', phaseData.data);
        setPhases(phaseData.data || []);
        const commitData = await axios.get(`http://127.0.0.1:8000/api/commitments/?prm=${details.name}&phase=${phaseData.data[0]?.name}`, { withCredentials: true });
        console.log('commitment data:', commitData.data);
        setCommitment(commitData.data[0] || {});
      } catch (error) {
        console.error(error);
      }
    };
    fetchAll();
  }, [details]);

  if (loading) return <div className="loader">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!details) return <div className="error">Pas de données disponibles.</div>;

  return (
    <div className="polygon-container">
      <div className="header-image">
        <img src={details.image_url || "https://logowik.com/content/uploads/images/t_sonatrach7710.jpg"} alt="Polygon" />
        <div className="header-overlay">
          <h1>{details.name || 'Détails du Polygone'}</h1>
          <p>{details.status || 'Statut inconnu'}</p>
        </div>
      </div>

      <div className="info-section">
        <InfoCard title="Infos Générales">
          <Field label="Nom" value={details.name} />
          <Field label="Notes" value={details.notes} />
          <Field label="Statut" value={details.status} />
        </InfoCard>

        <InfoCard title="Contrat">
          <Field label="N° de contrat" value={contract.num} />
          <Field label="Signature" value={contract.signatureDate} />
          <Field label="Entrée en vigueur" value={contract.effectiveDate} />
          <Field label="Échéance" value={contract.ech_date} />
          <Field label="Période actuelle" value={contract.effectiveDate && contract.ech_date ? `${contract.effectiveDate} → ${contract.ech_date}` : 'N/A'} />
          <Field label="Phase actuelle" value={phases[0]?.name} />
        </InfoCard>

        <InfoCard title="Phases">
          {['Phase 1', 'Phase 2', 'Phase 3'].map((phase) => (
            <Field key={phase} label={phase} value={phases.find(p => p.name === phase)?.end_date} />
          ))}
        </InfoCard>

        <InfoCard title="Engagements">
          <Field label="Puits (Total)" value={(commitment.puitsWildcat || 0) + (commitment.puitsDelineation || 0) + (commitment.puitsAppreciation || 0)} />
          <Field label="Sismique 2D" value={commitment.retraitement2D} />
          <Field label="Sismique 3D" value={commitment.retraitement3D} />
        </InfoCard>

        <InfoCard title="Système Pétrolier">
          <Field label="Roche mère" value="N/A" />
          <Field label="Réservoir" value="N/A" />
          <Field label="Couverture" value="N/A" />
          <Field label="Piège" value="N/A" />
        </InfoCard>
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="info-card">
      <h2>{title}</h2>
      <div className="card-content">{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <span className="field-value">{value || 'N/A'}</span>
    </div>
  );
}

export default PolygonDetails;
