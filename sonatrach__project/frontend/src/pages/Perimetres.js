// // export function Perimetres() {
// //     return <div className="p-4">Section Périmètres</div>;
// //   }
// // ---------------------------------------------------------------------


// // import React from 'react';

// // export function Perimeters() {
// //     return (
// //         <div className="p-4">
// //             <h2 className="text-2xl font-bold mb-4">Périmètres</h2>
// //             <div className="bg-white rounded-lg shadow p-6">
// //                 <p className="text-gray-600">Contenu de la section Périmètres</p>
// //             </div>
// //         </div>
// //     );
// // }



// import React, { useState } from 'react';
// import { Bar, Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
// import './perimetres.css';
// import { useParams, useNavigate } from 'react-router-dom';


// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// function Perimetres() {
//   const { name } = useParams();
//   const perimetreName = decodeURIComponent(name).normalize('NFC');;
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [rechercheDemande, setRechercheDemande] = useState('');
//   const [perimetre, setPerimetre] = useState(name);
//   const [contractNumber, setContractNumber] = useState('CTR_09222');
//   const [signatureDate, setSignatureDate] = useState('2019-10-20');
//   const [effectiveDate, setEffectiveDate] = useState('2019-12-10');
//   const [contractDuration, setContractDuration] = useState(84);
//   const [selectedPhase, setSelectedPhase] = useState('PHASE 3');
//   const [phases, setPhases] = useState([
//     { phase: 'PHASE 1', duration: 0, surface: 0 }
//   ]);
//   const [engagements, setEngagements] = useState([
//     { phase: 'PHASE 1', duration: 36, surface: 30, sismique2D: 0, sismique3D: 0, retraitement2D: 0, retraitement3D: 0, puitsWildcat: 0, puitsDelineation: 0, puitsAppreciation: 0, tests: 0, etudesG_G: 0, acquisitionGravimetrie: 0, traitementGravimetrie: 0 },
//     { phase: 'PHASE 2', duration: 24, surface: 30, sismique2D: 0, sismique3D: 0, retraitement2D: 0, retraitement3D: 0, puitsWildcat: 0, puitsDelineation: 0, puitsAppreciation: 0, tests: 0, etudesG_G: 0, acquisitionGravimetrie: 0, traitementGravimetrie: 0 },
//     { phase: 'PHASE 3', duration: 24, surface: 30, sismique2D: 0, sismique3D: 0, retraitement2D: 0, retraitement3D: 0, puitsWildcat: 0, puitsDelineation: 0, puitsAppreciation: 0, tests: 0, etudesG_G: 0, acquisitionGravimetrie: 0, traitementGravimetrie: 0 },
//   ]);
//   const [demandes, setDemandes] = useState([
//     { numeroDemande: 'NA', dateDemande: 'N/A', demande: 'Non', dateReponse: 'N/A', accordee: 'N/A', reponse: '' },
//   ]);

//   const filteredDemandes = demandes.filter(demande =>
//     demande.numeroDemande.toLowerCase().includes(rechercheDemande.toLowerCase())
//   );
//   const [realisationsTab, setRealisationsTab] = useState('Sismiques');

//   const barData = {
//     labels: ['2D - Phase 1', '3D - Phase 1', '2D - Phase 2', '3D - Phase 2', '2D - Phase 3', '3D - Phase 3'],
//     datasets: [
//       {
//         label: 'Travaux sismiques',
//         data: [0, 0, 0, 1318, 0, 0],
//         backgroundColor: ['#006633', '#FF9800', '#006633', '#FF9800', '#006633', '#FF9800'],
//       },
//     ],
//   };

//   const doughnutData = {
//     labels: ['Études G&G', 'Forage'],
//     datasets: [
//       {
//         data: [30, 70],
//         backgroundColor: ['#006633', '#FF9800'],
//       },
//     ],
//   };

 

//   const handleNext = () => {
//     if (step < 5) setStep(step + 1);
//   };

//   const handleBack = () => {
//     if (step > 1) setStep(step - 1);
//     else navigate('/');
//   };

//   const handleAddEngagement = () => {
//     setEngagements([...engagements, { phase: `PHASE ${engagements.length + 1}`, duration: 0, surface: 0, sismique2D: 0, sismique3D: 0, retraitement2D: 0, retraitement3D: 0, puitsWildcat: 0, puitsDelineation: 0, puitsAppreciation: 0, tests: 0, etudesG_G: 0, acquisitionGravimetrie: 0, traitementGravimetrie: 0 }]);
//   };


//   const handleAddPhase = () => {
//     setPhases([...phases, {
//       phase: `PHASE ${phases.length + 1}`,
//       duration: 0,
//       surface: 0
//     }]);
//   };

//   const handleUpdatePhase = (index, field, value) => {
//     const newPhases = [...phases];
//     newPhases[index][field] = value;
//     setPhases(newPhases);
//   };

//   const handleDeletePhase = (index) => {
//     if (index === 0) return; // Prevent deleting the first phase
//     const newPhases = phases.filter((_, i) => i !== index);
//     setPhases(newPhases);
//   };

//   const calculateEndDate = () => {
//     if (!effectiveDate || !contractDuration) return '';
//     const startDate = new Date(effectiveDate);
//     const endDate = new Date(startDate);
//     endDate.setMonth(startDate.getMonth() + Number(contractDuration));
//     return endDate.toISOString().split('T')[0];
//   };

  

//   const handleAddNewContract = () => {
//     setPerimetre('');
//     setContractNumber('');
//     setSignatureDate('');
//     setEffectiveDate('');
//     setContractDuration('');
//     setPhases([{ phase: 'PHASE 1', duration: 0, surface: 0 }]);
//     setEngagements([{ phase: 'PHASE 1', duration: 0, surface: 0, sismique2D: 0, sismique3D: 0, retraitement2D: 0, retraitement3D: 0, puitsWildcat: 0, puitsDelineation: 0, puitsAppreciation: 0, tests: 0, etudesG_G: 0, acquisitionGravimetrie: 0, traitementGravimetrie: 0 }]);
//     setDemandes([]);
//     setStep(1);
//   };

//   return (
//     <div className="perimetre-container">
//       {/* <div className="content-container mb-6 flex justify-between">
//         <button onClick={() => navigate('/')} className="back-to-list-button">
//           Retour à la liste
//         </button>
//         </div> */}
        
//       <div className="stepper">
//         <div className="step">
//           <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
//           <span className="step-label">Contract</span>
//         </div>
//         <div className={`step-connector ${step >= 2 ? 'active' : ''}`} />
//         <div className="step">
//           <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
//           <span className="step-label">suivi Contractuel</span>
//         </div>
//         <div className={`step-connector ${step >= 3 ? 'active' : ''}`} />
//         <div className="step">
//           <div className={`step-circle ${step >= 3 ? 'active' : ''}`}>3</div>
//           <span className="step-label">Engagements</span>
//         </div>
//         <div className={`step-connector ${step >= 4 ? 'active' : ''}`} />
//         <div className="step">
//           <div className={`step-circle ${step >= 4 ? 'active' : ''}`}>4</div>
//           <span className="step-label">Requêtes</span>
//         </div>
//         <div className={`step-connector ${step >= 5 ? 'active' : ''}`} />
//         <div className="step">
//           <div className={`step-circle ${step >= 5 ? 'active' : ''}`}>5</div>
//           <span className="step-label">Réalisations</span>
//         </div>
//       </div>

//       <div className="content-container">

//       {step === 1 && (
//   <div>
    
//         <button onClick={handleAddNewContract} className="add-contract-button">
//           Ajouter un nouveau contrat
//         </button>
      
//     <h2>Initialisation situation contractuelle du périmètre {perimetre}</h2>
//     <div className="form-grid">
//       <div className="form-group">
//         <label>Numéro du contrat</label>
//         <input
//           type="text"
//           value={contractNumber}
//           onChange={(e) => setContractNumber(e.target.value)}
//         />
//       </div>
//       <div className="form-group">
//         <label>Date de signature de contrat</label>
//         <input
//           type="date"
//           value={signatureDate}
//           onChange={(e) => setSignatureDate(e.target.value)}
//         />
//       </div>
//       <div className="form-group">
//         <label>Date d’entrée en vigueur</label>
//         <input
//           type="date"
//           value={effectiveDate}
//           onChange={(e) => setEffectiveDate(e.target.value)}
//         />
//       </div>
//       <div className="form-group">
//         <label>Durée du contrat (mois)</label>
//         <input
//           type="number"
//           value={contractDuration}
//           onChange={(e) => setContractDuration(e.target.value)}
//         />
//       </div>
//     </div>

//     {/* Phases Table */}
//     <div className="phases-table-container">
//       <h3>Phases</h3>
//       <button onClick={handleAddPhase} className="add-button">
//         Ajouter une phase
//       </button>
//       <div className="table-container">
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Phase</th>
//               <th>Durée (mois)</th>
//               <th>Superficie à rendre (%)</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {phases.map((phase, index) => (
//               <tr key={index}>
//                 <td>{phase.phase}</td>
//                 <td>
//                   <input
//                     type="number"
//                     value={phase.duration}
//                     onChange={(e) => handleUpdatePhase(index, 'duration', e.target.value)}
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     value={phase.surface}
//                     onChange={(e) => handleUpdatePhase(index, 'surface', e.target.value)}
//                   />
//                 </td>
//                 <td className="flex space-x-2">
//                   <button
//                     onClick={() => handleDeletePhase(index)}
//                     disabled={index === 0}
//                     className="action-button delete disabled:opacity-50"
//                   >
//                     🗑️
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// )}

//         {step === 2 && (
//           <div>
//             <h2>suivi Contractuel {perimetre}</h2>
//             <button onClick={handleAddEngagement} className="add-button">
//               Ajouter une phase
//             </button>
//             <div className="table-container">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Phase</th>
//                     <th>Durée (mois)</th>
//                     <th>Superficie à rendre (%)</th>
//                     <th>Acquisition Sismique 2D (KM)</th>
//                     <th>Acquisition Sismique 3D (KM²)</th>
//                     <th>Retraitement 2D</th>
//                     <th>Retraitement 3D</th>
//                     <th>Puits Wildcat</th>
//                     <th>Puits Délinéation</th>
//                     <th>Puits d’Appréciation</th>
//                     <th>Tests</th>
//                     <th>Études G&G</th>
//                     <th>Acquisition Gravimétrie</th>
//                     <th>Traitement Gravimétrie</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {engagements.map((engagement, index) => (
//                     <tr key={index}>
//                       <td>{engagement.phase}</td>
//                       <td>{engagement.duration}</td>
//                       <td>{engagement.surface}</td>
//                       <td>{engagement.sismique2D}</td>
//                       <td>{engagement.sismique3D}</td>
//                       <td>{engagement.retraitement2D}</td>
//                       <td>{engagement.retraitement3D}</td>
//                       <td>{engagement.puitsWildcat}</td>
//                       <td>{engagement.puitsDelineation}</td>
//                       <td>{engagement.puitsAppreciation}</td>
//                       <td>{engagement.tests}</td>
//                       <td>{engagement.etudesG_G}</td>
//                       <td>{engagement.acquisitionGravimetrie}</td>
//                       <td>{engagement.traitementGravimetrie}</td>
//                       <td className="flex space-x-2">
//                         <button className="action-button edit">✏️</button>
//                         <button className="action-button delete">🗑️</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

// {step === 3 && (
//           <div>
//           <div className="header-container">
//             <h2>Engagements {perimetre}</h2>
//             <div className="header-row">
//     <div className="header-actions">
//       <div className="form-group">
//         <label>Phase</label>
//         <select
//           value={selectedPhase}
//           onChange={(e) => setSelectedPhase(e.target.value)}
//         >
//           {phases.map((phase) => (
//             <option key={phase.phase} value={phase.phase}>
//               {phase.phase}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>

//     <button onClick={handleAddPhase} className="add-buttonn">
//       Ajouter une phase
//     </button>
//   </div>
//           </div>

//           {/* Date Range */}
//           <div className="date-range">
//             Du {effectiveDate} AU {calculateEndDate()}
//           </div>

//           {/* Engagements Table */}
//           <div className="table-container">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Engagement</th>
//                   <th>Engagement contractuel</th>
//                   <th>Reste à réaliser phase précédente</th>
//                   <th>Engagement Effectif initial</th>
//                   <th>Reste à réaliser</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   { label: 'Acquisition Sismique 2D (KM)', field: 'sismique2D' },
//                   { label: 'Acquisition Sismique 3D (KM²)', field: 'sismique3D' },
//                   { label: 'Retraitement 2D', field: 'retraitement2D' },
//                   { label: 'Retraitement 3D', field: 'retraitement3D' },
//                   { label: 'Puits Wildcat', field: 'puitsWildcat' },
//                   { label: 'Puits Délinéation', field: 'puitsDelineation' },
//                   { label: 'Puits d’Appréciation', field: 'puitsAppreciation' },
//                   { label: 'Tests', field: 'tests' },
//                   { label: 'Études G&G', field: 'etudesG_G' },
//                   { label: 'Acquisition Gravimétrie', field: 'acquisitionGravimetrie' },
//                   { label: 'Traitement Gravimétrie', field: 'traitementGravimetrie' },
//                 ].map((item, index) => {
//                   const phaseData = engagements.find((e) => e.phase === selectedPhase);
//                   return (
//                     <tr key={index}>
//                       <td>{item.label}</td>
//                       <td>
//                         <input
//                           type="number"
//                           value={phaseData[item.field].contractuel}
//                           onChange={(e) => handleUpdateEngagement(item.field, 'contractuel', e.target.value)}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           value={phaseData[item.field].restePhase}
//                           onChange={(e) => handleUpdateEngagement(item.field, 'restePhase', e.target.value)}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           value={phaseData[item.field].effectif}
//                           onChange={(e) => handleUpdateEngagement(item.field, 'effectif', e.target.value)}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           value={phaseData[item.field].resteRealiser}
//                           onChange={(e) => handleUpdateEngagement(item.field, 'resteRealiser', e.target.value)}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         )}

// {step === 4 && (
//           <div>
//             <h2>Engagements {perimetre}</h2>
//             <div className="search-filterrr">
//               <div className="search-containerrr">
//                 <span className="search-iconnn">🔍</span>
//                 <input
//                   type="text"
//                   className="search-inputt"
//                   placeholder="Rechercher une demande"
//                   onChange={(e) => setRechercheDemande(e.target.value)}
//                 />{rechercheDemande && (
//                   <span className="clear-iconnn" onClick={() => setRechercheDemande('')}>
//                     ✕
//                   </span>
//                 )}
                
//               </div>

//             </div>
//             <div className="table-container">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>N° de la demande</th>
//                     <th>Date Demande</th>
//                     <th>Demande</th>
//                     <th>Date Réponse</th>
//                     <th>Accordée</th>
//                     <th>Réponse</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredDemandes.map((demande, index) => (
//                     <tr key={index}>
//                       <td>{demande.numeroDemande}</td>
//                       <td>{demande.dateDemande}</td>
//                       <td>{demande.demande}</td>
//                       <td>{demande.dateReponse}</td>
//                       <td>{demande.accordee}</td>
//                       <td>{demande.reponse}</td>
//                       {/* <td className="flex space-x-2">
//                         <button className="action-button edit">✏️</button>
//                         <button className="action-button delete">🗑️</button>
//                       </td> */}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {step === 5 && (
//           <div>
//           <h2>Requêtes {perimetre}</h2>
//           <div className="tab-buttons">
//             {['Sismiques', 'Forage', 'Études G&G', 'Tableau de bord'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setRealisationsTab(tab)}
//                 className={`tab-button ${realisationsTab === tab ? 'active' : ''}`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//           {realisationsTab === 'Sismiques' && (
//             <div className="table-container">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Désignations</th>
//                     <th>Périmètre</th>
//                     <th>Nom de l’étude</th>
//                     <th>Date Début</th>
//                     <th>Date Fin</th>
//                     <th>Compagnie de service</th>
//                     <th>Kilométrage</th>
//                     <th>Coûts</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>Acquisition</td>
//                     <td>GARET EL BOUIB III</td>
//                     <td>23-HBAW-3D</td>
//                     <td>2023-11-18</td>
//                     <td>2024-03-12</td>
//                     <td>EGS-270</td>
//                     <td>1318</td>
//                     <td>-</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           )}
//           {realisationsTab === 'Forage' && <div>Forage data goes here...</div>}
//           {realisationsTab === 'Études G&G' && <div>Études G&G data goes here...</div>}
//           {realisationsTab === 'Tableau de bord' && (
//             <div className="chart-grid">
//               <div>
//                 <h3>Travaux sismiques</h3>
//                 <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
//               </div>
//               <div>
//                 <h3>Taux d’avancement</h3>
//                 <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
//               </div>
//             </div>
//           )}
//         </div>
          
//         )}

//         <div className="navigation-buttons">
//           <button onClick={handleBack} disabled={step === 1}>Retour</button>
//           <button onClick={handleNext}>{step === 5 ? 'Terminer' : 'Suivant'}</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Perimetres;


// -----------------------------------------------------------


import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import './perimetres.css';
import { useParams, useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Perimetres() {
  const { name } = useParams();
  const perimetreName = decodeURIComponent(name).normalize('NFC');
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [rechercheDemande, setRechercheDemande] = useState('');
  const [perimetre, setPerimetre] = useState(perimetreName);
  const [contractNumber, setContractNumber] = useState('');
  const [signatureDate, setSignatureDate] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [contractDuration, setContractDuration] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState('');
  const [phases, setPhases] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [engagementDetails, setEngagementDetails] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [realisationsTab, setRealisationsTab] = useState('Sismiques');
  const [sismiques, setSismiques] = useState([]);
  const [forages, setForages] = useState([]);
  const [etudesGG, setEtudesGG] = useState([]);

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/contracts/?prm=${perimetreName}`);
        const data = await response.json();
        const contract = data.length > 0 ? data[0] : null;
        if (contract) {
          setContractNumber(contract.contractNumber);
          setSignatureDate(contract.signatureDate);
          setEffectiveDate(contract.effectiveDate);
          setContractDuration(contract.contractDuration);
          setPhases(contract.phases || []);
          setSelectedPhase(contract.phases && contract.phases.length > 0 ? contract.phases[0].name : '');
        }
      } catch (error) {
        console.error('Error fetching contract data:', error);
      }
    };

    const fetchEngagements = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/commitments/?prm=${perimetreName}`);
        const data = await response.json();
        setEngagements(data || []);
      } catch (error) {
        console.error('Error fetching engagements:', error);
      }
    };

    const fetchDemandes = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/demandes/?prm=${perimetreName}`);
        const data = await response.json();
        setDemandes(data || []);
      } catch (error) {
        console.error('Error fetching demandes:', error);
      }
    };

    const fetchRealisations = async () => {
      try {
//      t_sis_realisation
        const sismiquesResponse = await fetch(`http://127.0.0.1:8000/api/sismiques/?prm=${perimetreName}`);
        const sismiquesData = await sismiquesResponse.json();
        console.log("Sismiques API Response:", sismiquesData);
        setSismiques(sismiquesData || []);
//      table "t_Well"
        const foragesResponse = await fetch(`http://127.0.0.1:8000/api/puits/?prm=${perimetreName}`);
        const foragesData = await foragesResponse.json();
        console.log("Forages API Response:", foragesData);
        setForages(foragesData || []);
//      table t_gg_realisation
        const etudesGGResponse = await fetch(`http://127.0.0.1:8000/api/etudes/?prm=${perimetreName}`);
        const etudesGGData = await etudesGGResponse.json();
        console.log("EtudesGG API Response:", etudesGGData);
        setEtudesGG(etudesGGData || []);
      } catch (error) {
        console.error('Error fetching realisations:', error);
      }
    };

    fetchContractData();
    fetchEngagements();
    fetchDemandes();
    fetchRealisations();
  }, [perimetreName]);

  useEffect(() => {
    const fetchEngagementDetails = async () => {
      if (selectedPhase) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/commitments/details/?prm=${perimetreName}&phase=${selectedPhase}`);
          const data = await response.json();
          setEngagementDetails(data || []);
        } catch (error) {
          console.error('Error fetching engagement details:', error);
        }
      }
    };

    fetchEngagementDetails();
  }, [selectedPhase, perimetreName]);

  const filteredDemandes = demandes.filter(demande =>
    demande.numeroDemande.toLowerCase().includes(rechercheDemande.toLowerCase())
  );

  const barData = {
    labels: engagements.flatMap(e => [
      `2D - ${e.phase}`,
      `3D - ${e.phase}`
    ]),
    datasets: [
      {
        label: 'Travaux sismiques',
        data: engagements.flatMap(e => [
          e.sismique2D || 0,
          e.sismique3D || 0
        ]),
        backgroundColor: engagements.flatMap(() => ['#006633', '#FF9800']),
      },
    ],
  };

  const doughnutData = {
    labels: ['Études G&G', 'Forage'],
    datasets: [
      {
        data: [etudesGG.length, forages.length],
        backgroundColor: ['#006633', '#FF9800'],
      },
    ],
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  const handleAddPhase = async () => {
    const newPhaseName = `Phase ${phases.length + 1}`;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/phases/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPhaseName,
          ctr: contractNumber,
          duration: 0,
          start_date: effectiveDate,
          end_date: effectiveDate,
          contract_pct: 0,
          actual_pct: 0,
          surface_rendu: null,
          rem_2d: 0,
          rem_3d: 0,
          rem_wc: 0,
          rem_d: 0,
          rem_gg: 0,
        }),
      });
      const newPhase = await response.json();
      setPhases([...phases, newPhase]);
    } catch (error) {
      console.error('Error adding phase:', error);
    }
  };

  const handleUpdatePhase = async (index, field, value) => {
    const phase = phases[index];
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/phases/${phase.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [field]: field === 'surface' ? parseFloat(value) : parseInt(value),
        }),
      });
      const updatedPhase = await response.json();
      const newPhases = [...phases];
      newPhases[index] = updatedPhase;
      setPhases(newPhases);
    } catch (error) {
      console.error('Error updating phase:', error);
    }
  };

  const handleDeletePhase = async (index) => {
    if (index === 0) return;
    const phase = phases[index];
    try {
      await fetch(`http://127.0.0.1:8000/api/phases/${phase.id}/`, {
        method: 'DELETE',
      });
      const newPhases = phases.filter((_, i) => i !== index);
      setPhases(newPhases);
    } catch (error) {
      console.error('Error deleting phase:', error);
    }
  };

  const calculateEndDate = () => {
    if (!effectiveDate || !contractDuration) return '';
    const startDate = new Date(effectiveDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + Number(contractDuration));
    return endDate.toISOString().split('T')[0];
  };

  const handleAddNewContract = () => {
    setPerimetre('');
    setContractNumber('');
    setSignatureDate('');
    setEffectiveDate('');
    setContractDuration(0);
    setPhases([]);
    setEngagements([]);
    setDemandes([]);
    setStep(1);
  };

  return (
    <div className="perimetre-container">
      <div className="stepper">
        <div className="step">
          <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
          <span className="step-label">Contract</span>
        </div>
        <div className={`step-connector ${step >= 2 ? 'active' : ''}`} />
        <div className="step">
          <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
          <span className="step-label">suivi Contractuel</span>
        </div>
        <div className={`step-connector ${step >= 3 ? 'active' : ''}`} />
        <div className="step">
          <div className={`step-circle ${step >= 3 ? 'active' : ''}`}>3</div>
          <span className="step-label">Engagements</span>
        </div>
        <div className={`step-connector ${step >= 4 ? 'active' : ''}`} />
        <div className="step">
          <div className={`step-circle ${step >= 4 ? 'active' : ''}`}>4</div>
          <span className="step-label">Requêtes</span>
        </div>
        <div className={`step-connector ${step >= 5 ? 'active' : ''}`} />
        <div className="step">
          <div className={`step-circle ${step >= 5 ? 'active' : ''}`}>5</div>
          <span className="step-label">Réalisations</span>
        </div>
      </div>

      <div className="content-container">
        {/* table t_contracts */}
        {step === 1 && (
          <div>
            <button onClick={handleAddNewContract} className="add-contract-button">
              Ajouter un nouveau contrat
            </button>
            <h2>Initialisation situation contractuelle du périmètre {perimetre}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Numéro du contrat</label>
                <input
                  type="text"
                  value={contractNumber}
                  onChange={(e) => setContractNumber(e.target.value)}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Date de signature de contrat</label>
                <input
                  type="date"
                  value={signatureDate}
                  onChange={(e) => setSignatureDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Date d’entrée en vigueur</label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Durée du contrat (mois)</label>
                <input
                  type="number"
                  value={contractDuration}
                  onChange={(e) => setContractDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="phases-table-container">
              <h3>Phases</h3>
              <button onClick={handleAddPhase} className="add-button">
                Ajouter une phase
              </button>
              <div className="table-container">
                {/* table t_phases */}
                <table className="table">
                  <thead>
                    <tr>
                      <th>Phase</th>
                      <th>Durée (mois)</th>
                      <th>Superficie à rendre (%)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phases.map((phase, index) => (
                      <tr key={index}>
                        <td>{phase.name}</td>
                        <td>
                          <input
                            type="number"
                            value={phase.duration}
                            onChange={(e) => handleUpdatePhase(index, 'duration', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={phase.surface}
                            onChange={(e) => handleUpdatePhase(index, 'surface', e.target.value)}
                          />
                        </td>
                        <td className="flex space-x-2">
                          <button
                            onClick={() => handleDeletePhase(index)}
                            disabled={index === 0}
                            className="action-button delete disabled:opacity-50"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2>suivi Contractuel {perimetre}</h2>
            <button onClick={handleAddPhase} className="add-button">
              Ajouter une phase
            </button>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Phase</th>
                    <th>Durée (mois)</th>
                    <th>Superficie à rendre (%)</th>
                    <th>Acquisition Sismique 2D (KM)</th>
                    <th>Acquisition Sismique 3D (KM²)</th>
                    <th>Retraitement 2D</th>
                    <th>Retraitement 3D</th>
                    <th>Puits Wildcat</th>
                    <th>Puits Délinéation</th>
                    <th>Puits d’Appréciation</th>
                    <th>Tests</th>
                    <th>Études G&G</th>
                    <th>Acquisition Gravimétrie</th>
                    <th>Traitement Gravimétrie</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {engagements.map((engagement, index) => (
                    // table t_commitement
                    <tr key={index}>
                      <td>{engagement.phase}</td>
                      <td>{engagement.duration}</td>
                      <td>{engagement.surface}</td>
                      <td>{engagement.sismique2D}</td>
                      <td>{engagement.sismique3D}</td>
                      <td>{engagement.retraitement2D}</td>
                      <td>{engagement.retraitement3D}</td>
                      <td>{engagement.puitsWildcat}</td>
                      <td>{engagement.puitsDelineation}</td>
                      <td>{engagement.puitsAppreciation}</td>
                      <td>{engagement.tests}</td>
                      <td>{engagement.etudesG_G}</td>
                      <td>{engagement.acquisitionGravimetrie}</td>
                      <td>{engagement.traitementGravimetrie}</td>
                      <td className="flex space-x-2">
                        <button className="action-button edit">✏️</button>
                        <button className="action-button delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="header-container">
              <h2>Engagements {perimetre}</h2>
              <div className="header-row">
                <div className="header-actions">
                  <div className="form-group">
                    <label>Phase</label>
                    <select
                      value={selectedPhase}
                      onChange={(e) => setSelectedPhase(e.target.value)}
                    >
                      {phases.map((phase) => (
                        <option key={phase.name} value={phase.name}>
                          {phase.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={handleAddPhase} className="add-buttonn">
                  Ajouter une phase
                </button>
              </div>
            </div>

            <div className="date-range">
              Du {effectiveDate} AU {calculateEndDate()}
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Engagement</th>
                    <th>Engagement contractuel</th>
                    <th>Reste à réaliser phase suivante</th>
                    <th>Engagement Effectif initial</th>
                    <th>Reste à réaliser</th>
                  </tr>
                </thead>
                <tbody>
                  {engagementDetails.map((item, index) => (
                    <tr key={index}>
                      <td>{item.label}</td>
                      <td>{item.contractuel}</td>
                      <td>{item.restePhase}</td>
                      <td>{item.effectif}</td>
                      <td>{item.resteRealiser}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2>Engagements {perimetre}</h2>
            <div className="search-filterrr">
              <div className="search-containerrr">
                <span className="search-iconnn">🔍</span>
                <input
                  type="text"
                  className="search-inputt"
                  placeholder="Rechercher une demande"
                  value={rechercheDemande}
                  onChange={(e) => setRechercheDemande(e.target.value)}
                />
                {rechercheDemande && (
                  <span className="clear-iconnn" onClick={() => setRechercheDemande('')}>
                    ✕
                  </span>
                )}
              </div>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>N° de la demande</th>
                    <th>Date Demande</th>
                    <th>Demande</th>
                    <th>Date Réponse</th>
                    <th>Accordée</th>
                    <th>Réponse</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDemandes.map((demande, index) => (
                    <tr key={index}>
                      <td>{demande.numeroDemande}</td>
                      <td>{demande.dateDemande}</td>
                      <td>{demande.demande}</td>
                      <td>{demande.dateReponse}</td>
                      <td>{demande.accordee}</td>
                      <td>{demande.reponse}</td>
                      <td className="flex space-x-2">
                        <button className="action-button edit">✏️</button>
                        <button className="action-button delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2>Requêtes {perimetre}</h2>
            <div className="tab-buttons">
              {['Sismiques', 'Forage', 'Études G&G', 'Tableau de bord'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRealisationsTab(tab)}
                  className={`tab-button ${realisationsTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {realisationsTab === 'Sismiques' && (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Désignations</th>
                      <th>Périmètre</th>
                      <th>Nom de l’étude</th>
                      <th>Date Début</th>
                      <th>Date Fin</th>
                      <th>Compagnie de service</th>
                      <th>Kilométrage</th>
                      <th>Coûts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sismiques.map((sismique, index) => (
                      <tr key={index}>
                        <td>{sismique.name}</td>
                        <td>{sismique.prm}</td>
                        <td>{sismique.type}</td>
                        <td>{sismique.start_date}</td>
                        <td>{sismique.end_date}</td>
                        <td>{sismique.company}</td>
                        <td>{sismique.kilometrage}</td>
                        <td>{sismique.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {realisationsTab === 'Forage' && (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sigle</th>
                      <th>Nom</th>
                      <th>Périmètre</th>
                      <th>Type</th>
                      <th>Objectif</th>
                      <th>Date Début</th>
                      <th>Date Fin</th>
                      <th>Résultat</th>
                      <th>État</th>
                      <th>Coût</th>
                      <th>Compagnie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forages.map((forage, index) => (
                      <tr key={index}>
                        {/* table "t_Well" */}
                        <td>{forage.sigle|| 'N/A'}</td>
                        <td>{forage.name|| 'N/A'}</td>
                        <td>{forage.prm.name|| 'N/A'}</td>
                        <td>{forage.type|| 'N/A'}</td>
                        <td>{forage.objective|| 'N/A'}</td>
                        <td>{forage.start_date|| 'N/A'}</td>
                        <td>{forage.end_date|| 'N/A'}</td>
                        <td>{forage.result|| 'N/A'}</td>
                        <td>{forage.state|| 'N/A'}</td>
                        <td>{forage.cost|| 'N/A'}</td>
                        <td>{forage.company|| 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {realisationsTab === 'Études G&G' && (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Périmètre</th>
                      <th>Date Début</th>
                      <th>Date Fin</th>
                      <th>Compagnie</th>
                      <th>Coût</th>
                    </tr>
                  </thead>
                  <tbody>
                    {etudesGG.map((etude, index) => (
                      // table t_gg_realisation
                      <tr key={index}>
                        <td>{etude.name}</td>
                        <td>{etude.prm.name}</td>
                        <td>{etude.start_date}</td>
                        <td>{etude.end_date}</td>
                        <td>{etude.company}</td>
                        <td>{etude.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {realisationsTab === 'Tableau de bord' && (
              <div className="chart-grid">
                <div>
                  <h3>Travaux sismiques</h3>
                  <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                </div>
                <div>
                  <h3>Taux d’avancement</h3>
                  <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="navigation-buttons">
          <button onClick={handleBack} disabled={step === 1}>Retour</button>
          <button onClick={handleNext}>{step === 5 ? 'Terminer' : 'Suivant'}</button>
        </div>
      </div>
    </div>
  );
}

export default Perimetres;