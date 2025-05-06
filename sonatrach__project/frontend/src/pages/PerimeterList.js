// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './PerimeterList.css';

// function PerimeterList() {
//   const navigate = useNavigate();
//   const [perimeters, setPerimeters] = useState([
//     {
//       name: 'LOT DU 10/12/2019',
//       validity: 'Du 10/12/2019 au 10/12/2026',
//       blocs: '337, 330, 328, 333, 362, 335, 336, 334, 332, 330, 351, 352, 353, 341',
//       department: 'Tind Reggane Sbaa',
//       status: 'Contrat de recherche',
//       linkedPerimeters: '',
//       observation: '',
//     },
//     {
//       name: 'REGGANE II',
//       validity: 'Du 10/12/2019 au 10/12/2026',
//       blocs: '337, 330, 328, 333, 362, 335, 336, 334, 332, 330, 351, 352, 353, 341',
//       department: 'Tind Reggane Sbaa',
//       status: 'Contrat de recherche',
//       linkedPerimeters: '',
//       observation: '',
//     },
//     {
//       name: 'GARET EL BOUIB III',
//       validity: 'Du 10/12/2019 au 10/12/2026',
//       blocs: '425, 428, 430, 429, 438, 426, 431',
//       department: 'Tind Reggane Sbaa',
//       status: 'Contrat de recherche',
//       linkedPerimeters: '',
//       observation: '',
//     },
//     {
//       name: 'LOT DU 02/05/2024',
//       validity: 'Du 02/05/2024 au 02/05/2027',
//       blocs: '413, 412, 416, 433, 415, 414, 128',
//       department: 'Tind Reggane Sbaa',
//       status: 'Contrat de recherche',
//       linkedPerimeters: '',
//       observation: '',
//     },
//     {
//       name: 'MELRHIR',
//       validity: 'Du 02/05/2024 au 02/05/2027',
//       blocs: '413, 412, 416, 433, 415, 414, 128',
//       department: 'Tind Reggane Sbaa',
//       status: 'Contrat de recherche',
//       linkedPerimeters: '',
//       observation: '',
//     },
//     {
//       name: 'ILLIZI CENTRE',
//       validity: 'Du 02/05/2024 au 02/05/2031',
//       blocs: '222, 229, 223, 245, 239, 294, 221, 238',
//       department: 'Tind Reggane Sbaa',
//       status: 'Contrat de recherche',
//       linkedPerimeters: '',
//       observation: '',
//     },
//     {
//       name: 'EL BENNOUD',
//       validity: 'Du 02/05/2024 au 02/05/2031',
//       blocs: '120, 350, 408, 421, 312, 316, 116, 313, 315, 103, 314, 115',
//       department: 'Tind Reggane Sbaa',
//       status: 'Contrat de recherche',
//       linkedPerimeters: '',
//       observation: '',
//     },
//   ]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPerimeter, setSelectedPerimeter] = useState(null);
//   const [formData, setFormData] = useState({
//     department: '',
//     status: '',
//     name: '',
//     linkedPerimeters: '',
//     observation: '',
//   });

//   const handleInitialize = (perimeterName) => {
//   //   navigate(`/Perimetres/${encodeURIComponent(perimeterName)}`);
//   // };
//     // Normalize and encode the name properly
//     const normalizedPerimeterName = perimeterName.normalize('NFC');
//     navigate(`/Perimetres/${encodeURIComponent(normalizedPerimeterName)}`);
//   };

//   const handleUpdate = (perimeter) => {
//     setSelectedPerimeter(perimeter);
//     setFormData({
//       department: perimeter.department,
//       status: perimeter.status,
//       name: perimeter.name,
//       linkedPerimeters: perimeter.linkedPerimeters,
//       observation: perimeter.observation,
//     });
//     setIsModalOpen(true);
//   };

//   const handleDelete = (perimeterName) => {
//     setPerimeters(perimeters.filter((p) => p.name !== perimeterName));
//   };
//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setSelectedPerimeter(null);
//     setFormData({
//       department: '',
//       status: '',
//       name: '',
//       linkedPerimeters: '',
//       observation: '',
//     });
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     const updatedPerimeters = perimeters.map((p) =>
//       p.name === selectedPerimeter.name
//         ? { ...p, ...formData }
//         : p
//     );
//     setPerimeters(updatedPerimeters);
//     handleModalClose();
//   };

//   return (
//     <div className="perimeter-list-container">
//       {/* Header */}
//       <div className="headerr">
//         <h1>Portefeuille concessions</h1>
//         <div className="header-actions">
//           <button className="filter-buttonn">Filtrer</button>
//           <button className="new-button">Nouveau</button>
//         </div>
//       </div>

//       {/* Sidebar Navigation */}
//       <div className="main-content">
//         {/* <div className="sidebar">
//           <div className="sidebar-header">
//             <div className="logo-placeholder"></div>
//             <span>SONATRACH</span>
//           </div>
//           <nav className="sidebar-nav">
//             <a href="#" className="active">Périmètres</a>
//             <a href="#">Planning</a>
//             <a href="#">Programmes</a>
//             <a href="#">Surfaces</a>
//             <a href="#">Avenant & demandes</a>
//           </nav>
//         </div> */}

//         {/* Table */}
//         <div className="table-container">
//           <div className="table-header">
//             <div className="table-header-actions">
//               <input type="text" placeholder="Rechercher par nom" />
//               <select>
//                 <option>ASO</option>
//                 <option>ASE</option>
//                 <option>ASC</option>
//                 <option>ASN</option>
//               </select>
//             </div>
//           </div>

//           <table className="perimeter-table">
//             <thead>
//               <tr>
//                 <th>Nom du périmètre</th>
//                 <th>Validité</th>
//                 <th>Blocs</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {perimeters.map((perimeter, index) => (
//                 <tr key={index}>
//                   <td>
//                     {perimeter.name === 'REGGANE II' ? (
//                       <>
//                         <a href="#" onClick={() => handleInitialize(perimeter.name)} className="link">
//                           {perimeter.name}
//                         </a>
//                         <span className="fiche-link">Lien vers la fiche de synthèse</span>
//                       </>
//                     ) : (
//                       perimeter.name
//                     )}
//                   </td>
//                   <td>{perimeter.validity}</td>
//                   <td>{perimeter.blocs}</td>
//                   <td className="flex space-x-2">
//                     <button
//                       onClick={() => handleInitialize(perimeter.name)}
//                       className="action-button initialize"
//                       title="Initialiser le cadre contractuel"
//                     >
//                       📄
//                     </button>
//                     <button
//                       onClick={() => handleUpdate(perimeter.name)}
//                       className="action-button edit"
//                       title="Mise à jour d’un périmètre"
//                     >
//                       ✏️
//                     </button>
//                     <button
//                       onClick={() => handleDelete(perimeter.name)}
//                       className="action-button delete"
//                       title="Supprimer"
//                     >
//                       🗑️
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {/* Modal for Updating Perimeter */}
//       {isModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2>Mise à jour d’un périmètre</h2>
//               <button onClick={handleModalClose} className="modal-close-button">✕</button>
//             </div>
//             <form onSubmit={handleFormSubmit} className="modal-form">
//               <div className="form-group">
//                 <label>Département</label>
//                 <select
//                   name="department"
//                   value={formData.department}
//                   onChange={handleFormChange}
//                 >
//                   <option value="Tind Reggane Sbaa">Tind Reggane Sbaa</option>
//                   {/* Add more options as needed */}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Statut</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleFormChange}
//                 >
//                   <option value="Contrat de recherche">Contrat de recherche</option>
//                   {/* Add more options as needed */}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Nom du périmètre</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleFormChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Périmètres liés</label>
//                 <select
//                   name="linkedPerimeters"
//                   value={formData.linkedPerimeters}
//                   onChange={handleFormChange}
//                 >
//                   <option value="">Aucun</option>
//                   {perimeters
//                     .filter((p) => p.name !== formData.name)
//                     .map((p) => (
//                       <option key={p.name} value={p.name}>
//                         {p.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Observation</label>
//                 <textarea
//                   name="observation"
//                   value={formData.observation}
//                   onChange={handleFormChange}
//                   rows="3"
//                 />
//               </div>
//               <button type="submit" className="submit-button">
//                 Mettre à jour le périmètre
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PerimeterList;


// ------------------------------------------------


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PerimeterList.css';

function PerimeterList() {
  const navigate = useNavigate();
  const [perimeters, setPerimeters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerimeter, setSelectedPerimeter] = useState(null);
  const [formData, setFormData] = useState({
    department: '',
    status: '',
    name: '',
    linkedPerimeters: '',
    observation: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAsset, setFilterAsset] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch perimeters from the backend
  useEffect(() => {
    const fetchPerimeters = async () => {
      try {
        const queryParams = new URLSearchParams({
          search: searchTerm,
          dept__asset: filterAsset,
          status: filterStatus,
        }).toString();
        const response = await fetch(`http://127.0.0.1:8000/api/concessions/?${queryParams}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPerimeters(data || []);
      } catch (error) {
        console.error('Error fetching perimeters:', error);
      }
    };

    fetchPerimeters();
  }, [searchTerm, filterAsset, filterStatus]); // Re-fetch when search or filters change

  const handleInitialize = (perimeterName) => {
    const normalizedPerimeterName = perimeterName.normalize('NFC');
    navigate(`/Perimetres/${encodeURIComponent(normalizedPerimeterName)}`);
  };

  const handleUpdate = (perimeter) => {
    setSelectedPerimeter(perimeter);
    setFormData({
      department: perimeter.department,
      status: perimeter.status,
      name: perimeter.name,
      linkedPerimeters: perimeter.linkedPerimeters,
      observation: perimeter.observation,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (perimeterName) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/concessions/${perimeterName}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPerimeters(perimeters.filter((p) => p.name !== perimeterName));
      } else {
        console.error('Failed to delete perimeter');
      }
    } catch (error) {
      console.error('Error deleting perimeter:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPerimeter(null);
    setFormData({
      department: '',
      status: '',
      name: '',
      linkedPerimeters: '',
      observation: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/concessions/${selectedPerimeter.name}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          status: formData.status,
          dept: formData.department, // Map to backend field
          notes: formData.observation, // Map to backend field
          linked_prms: formData.linkedPerimeters ? [formData.linkedPerimeters] : [], // Map to backend field
          classification: selectedPerimeter.classification || 'Near field mature', // Required field
          init_area: selectedPerimeter.init_area || 1000.00, // Required field
          distance: selectedPerimeter.distance || 50.00, // Required field
          zones_fisc: selectedPerimeter.zones_fisc || 'Zone A', // Required field
          coords: null, // Optional field
          operator: selectedPerimeter.operator || 'Sonatrach', // Required field
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update perimeter');
      }
      const updatedPerimeter = await response.json();
      setPerimeters(perimeters.map((p) => (p.name === selectedPerimeter.name ? updatedPerimeter : p)));
      handleModalClose();
    } catch (error) {
      console.error('Error updating perimeter:', error);
    }
  };

  return (
    <div className="perimeter-list-container">
      {/* Header */}
      <div className="headerr">
        <h1>Portefeuille concessions</h1>
        <div className="header-actions">
          <button className="filter-buttonn">Filtrer</button>
          <button className="new-button">Nouveau</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Table */}
        <div className="table-container">
          <div className="table-header">
            <div className="table-header-actions">
              <input
                type="text"
                placeholder="Rechercher par nom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={filterAsset}
                onChange={(e) => setFilterAsset(e.target.value)}
              >
                <option value="">Tous</option>
                <option value="ASO">ASO</option>
                <option value="ASE">ASE</option>
                <option value="ASC">ASC</option>
                <option value="ASN">ASN</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tous Statuts</option>
                <option value="Contrat de recherche">Contrat de recherche</option>
                <option value="ACPO">ACPO</option>
                <option value="ACPN">ACPN</option>
                <option value="Concession Amont">Concession Amont</option>
              </select>
            </div>
          </div>

          <table className="perimeter-table">
            <thead>
              <tr>
                <th>Nom du périmètre</th>
                <th>Validité</th>
                <th>Blocs</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {perimeters.map((perimeter, index) => (
                <tr key={index}>
                  <td>
                    {/* {perimeter.name === 'REGGANE II' ? ( */}
                      <>
                        <a
                          // href="#"
                          onClick={() => handleInitialize(perimeter.name)}
                          className="link"
                        >
                          {perimeter.name}
                        </a>
                        {/* <span className="fiche-link">Lien vers la fiche de synthèse</span> */}
                      </>
                    {/* ) : (
                      perimeter.name
                    )} */}
                  </td>
                  <td>{perimeter.validity}</td>
                  <td>{perimeter.blocs}</td>
                  <td className="flex space-x-2">
                    <button
                      onClick={() => handleInitialize(perimeter.name)}
                      className="action-button initialize"
                      title="Initialiser le cadre contractuel"
                    >
                      📄
                    </button>
                    <button
                      onClick={() => handleUpdate(perimeter)} // Pass the entire perimeter object
                      className="action-button edit"
                      title="Mise à jour d’un périmètre"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(perimeter.name)}
                      className="action-button delete"
                      title="Supprimer"
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

      {/* Modal for Updating Perimeter */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Mise à jour d’un périmètre</h2>
              <button onClick={handleModalClose} className="modal-close-button">✕</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Département</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                >
                  <option value="Tind Reggane Sbaa">Tind Reggane Sbaa</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Contrat de recherche">Contrat de recherche</option>
                  <option value="ACPO">ACPO</option>
                  <option value="ACPN">ACPN</option>
                  <option value="Concession Amont">Concession Amont</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nom du périmètre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Périmètres liés</label>
                <select
                  name="linkedPerimeters"
                  value={formData.linkedPerimeters}
                  onChange={handleFormChange}
                >
                  <option value="">Aucun</option>
                  {perimeters
                    .filter((p) => p.name !== formData.name)
                    .map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label>Observation</label>
                <textarea
                  name="observation"
                  value={formData.observation}
                  onChange={handleFormChange}
                  rows="3"
                />
              </div>
              <button type="submit" className="submit-button">
                Mettre à jour le périmètre
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerimeterList;