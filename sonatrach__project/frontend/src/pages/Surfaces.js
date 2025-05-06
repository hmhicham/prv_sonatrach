// import React, { useState } from 'react';
// import './Surfaces.css';

// function Surfaces() {
//   // Sample data (replace with API data in a real app)
//   const [surfaces, setSurfaces] = useState([
//     { id: 1, name: 'Adrar morrt', type: 'POD', decouverte: '-', reservoir: '-', superficie: 1452 },
//     { id: 2, name: 'Zini Mahrouf', type: 'POD', decouverte: '-', reservoir: '-', superficie: 1478 },
//     { id: 3, name: 'Adrar morrt', type: 'POD', decouverte: '-', reservoir: '-', superficie: 1452 },
//     { id: 4, name: 'Zini Mahrouf', type: 'POD', decouverte: '-', reservoir: '-', superficie: 1478 },
//     { id: 5, name: 'Adrar morrt', type: 'POD', decouverte: '-', reservoir: '-', superficie: 1452 },
//     { id: 6, name: 'Zini Mahrouf', type: 'POD', decouverte: '-', reservoir: '-', superficie: 1478 },
//     { id: 7, name: 'Adrar morrt', type: 'POD', decouverte: '-', reservoir: '-', superficie: 1452 },
//     { id: 8, name: 'Zini Mahrouf', type: 'POD', decouverte: '-', reservoir: '-', superficie: 1478 },
//   ]);

//   // State for search and paginationa
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Filter surfaces based on search term
//   const filteredSurfaces = surfaces.filter(surface =>
//     surface.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredSurfaces.length / itemsPerPage);
//   const paginatedSurfaces = filteredSurfaces.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="surfaces-container">
//       <h1>Surfaces</h1>

//       {/* Search and Filter Section */}
//       <div className="surfaces-toolbar">
//         <input
//           type="text"
//           placeholder="Rechercher par nom..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//         <button className="filter-btn">Filtrer</button>
//       </div>

//       {/* Table */}
//       <div className="surfaces-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Nom de la surface</th>
//               <th>Type</th>
//               <th>Découverte</th>
//               <th>Réservoirs concernés</th>
//               <th>Superficie (km²)</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedSurfaces.map(surface => (
//               <tr key={surface.id}>
//                 <td>{surface.name}</td>
//                 <td>{surface.type}</td>
//                 <td>{surface.decouverte}</td>
//                 <td>{surface.reservoir}</td>
//                 <td>{surface.superficie}</td>
//                 <td>
//                   <button className="update-btn">Mettre à jour</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="pagination">
//         <button
//           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Précédent
//         </button>
//         <span>
//           {currentPage} / {totalPages}
//         </span>
//         <button
//           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         >
//           Suivant
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Surfaces;


import React, { useState } from 'react';
import './Surfaces.css';

function Surfaces() {
  const [surfaces, setSurfaces] = useState([
    { id: 1, name: 'Adrar morrt', type: 'POD', discovery: '-', reservoirs: '-', area: 1452 },
    { id: 2, name: 'Zini Mahrouf', type: 'POD', discovery: '-', reservoirs: '-', area: 1478 },
    { id: 3, name: 'Adrar morrt', type: 'POD', discovery: '-', reservoirs: '-', area: 1452 },
    { id: 4, name: 'Zini Mahrouf', type: 'POD', discovery: '-', reservoirs: '-', area: 1478 },
    { id: 5, name: 'Adrar morrt', type: 'POD', discovery: '-', reservoirs: '-', area: 1452 },
    { id: 6, name: 'Zini Mahrouf', type: 'POD', discovery: '-', reservoirs: '-', area: 1478 },
    { id: 7, name: 'Adrar morrt', type: 'POD', discovery: '-', reservoirs: '-', area: 1452 },
    { id: 8, name: 'Zini Mahrouf', type: 'POD', discovery: '-', reservoirs: '-', area: 1478 },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [surfaceToDelete, setSurfaceToDelete] = useState(null);
  const itemsPerPage = 5;

  const filteredSurfaces = surfaces.filter(surface =>
    surface.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSurfaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSurfaces = filteredSurfaces.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    setSurfaces(surfaces.filter(surface => surface.id !== id));
    setShowDeleteModal(false);
    setSurfaceToDelete(null);
  };

  return (
    <div className="surfaces-container">
      <div className="header">
        <h1>Surfaces</h1>
        <div className="search-filterr">
          <div className="search-containerr">
            <span className="search-iconn">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <span className="clear-iconn" onClick={() => setSearchTerm('')}>
                ✕
              </span>
            )}
          </div>
          <div className="filterr-button">
            <button>
              <span style={{ marginRight: '8px' }}>🖥️</span> Filtrer
            </button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom de la surface</th>
              <th>Type</th>
              <th>Découverte</th>
              <th>Réservoirs concernés</th>
              <th>Superficie (km²)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSurfaces.map((surface, index) => (
              <tr key={surface.id}>
                <td>{surface.name}</td>
                <td>{surface.type}</td>
                <td>{surface.discovery}</td>
                <td>{surface.reservoirs}</td>
                <td>{surface.area}</td>
                <td className="actions">
                  <button>✔️</button>
                  <button>✏️</button>
                  {/* <button
                    onClick={() => {
                      setSurfaceToDelete(surface.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    🗑️
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>Lignes par page: {itemsPerPage}</span>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span>{currentPage} de {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer cette surface ?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowDeleteModal(false)}>Annuler</button>
              <button onClick={() => handleDelete(surfaceToDelete)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Surfaces;