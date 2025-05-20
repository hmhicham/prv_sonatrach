// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './PlanningPMT.css';

// // Mock data (replace with API call)
// const mockData = [
//   { id: 1, taskName: 'Geological Study A', startDate: '2025-05-01', endDate: '2025-05-10', team: 'Team Alpha', priority: 'High', status: 'In Progress' },
//   { id: 2, taskName: 'Geological Study B', startDate: '2025-05-05', endDate: '2025-05-15', team: 'Team Beta', priority: 'Medium', status: 'In Progress' },
//   { id: 3, taskName: 'Geological Study C', startDate: '2025-04-25', endDate: '2025-05-01', team: 'Team Alpha', priority: 'Low', status: 'Completed' },
// ];

// const PlanningPMT = () => {
//   const [data, setData] = useState(mockData);
//   const [viewMode, setViewMode] = useState('table');
//   const [priorityFilter, setPriorityFilter] = useState('All');
//   const [teamFilter, setTeamFilter] = useState('All');

//   // Filter data
//   const filteredData = data.filter((item) => {
//     const priorityMatch = priorityFilter === 'All' || item.priority === priorityFilter;
//     const teamMatch = teamFilter === 'All' || item.team === teamFilter;
//     return priorityMatch && teamMatch;
//   });

//   const getTimelinePosition = (startDate, endDate) => {
//     const start = new Date(startDate).getDate();
//     const duration = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
//     return { start: start * 3, width: duration * 3 };
//   };

//   return (
//     <div className="planning-container">
//       <h1 className="planning-title">PMT Planning</h1>

//       <div className="planning-controls">
//         <div className="filter-group">
//           <label className="filter-label">Filter by Priority:</label>
//           <select
//             value={priorityFilter}
//             onChange={(e) => setPriorityFilter(e.target.value)}
//             className="filter-select"
//           >
//             <option value="All">All</option>
//             <option value="High">High</option>
//             <option value="Medium">Medium</option>
//             <option value="Low">Low</option>
//           </select>
//         </div>
//         <div className="filter-group">
//           <label className="filter-label">Filter by Team:</label>
//           <select
//             value={teamFilter}
//             onChange={(e) => setTeamFilter(e.target.value)}
//             className="filter-select"
//           >
//             <option value="All">All</option>
//             <option value="Team Alpha">Team Alpha</option>
//             <option value="Team Beta">Team Beta</option>
//           </select>
//         </div>
//         <button
//           onClick={() => setViewMode(viewMode === 'table' ? 'timeline' : 'table')}
//           className="view-toggle-button"
//         >
//           {viewMode === 'table' ? 'Switch to Timeline' : 'Switch to Table'}
//         </button>
//       </div>

//       {viewMode === 'table' && (
//         <div className="planning-table-container">
//           <table className="planning-table">
//             <thead>
//               <tr>
//                 <th>Task Name</th>
//                 <th>Start Date</th>
//                 <th>End Date</th>
//                 <th>Assigned Team</th>
//                 <th>Priority</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.taskName}</td>
//                   <td>{item.startDate}</td>
//                   <td>{item.endDate}</td>
//                   <td>{item.team}</td>
//                   <td>{item.priority}</td>
//                   <td>
//                     <span className={`status-badge ${item.status === 'Completed' ? 'status-completed' : 'status-in-progress'}`}>
//                       {item.status}
//                     </span>
//                   </td>
//                   <td>
//                     <button className="action-button action-edit">Edit</button>
//                     <button className="action-button action-details">Details</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {viewMode === 'timeline' && (
//         <div className="timeline-container">
//           <h2 className="timeline-title">Timeline View</h2>
//           <div className="timeline">
//             <div className="timeline-header">
//               {[...Array(31)].map((_, i) => (
//                 <div key={i} className="timeline-day">
//                   {i + 1}
//                 </div>
//               ))}
//             </div>
//             {filteredData.map((item) => {
//               const { start, width } = getTimelinePosition(item.startDate, item.endDate);
//               return (
//                 <div key={item.id} className="timeline-item">
//                   <div
//                     className="timeline-bar"
//                     style={{ left: `${start}px`, width: `${width}px` }}
//                   >
//                     <div className="timeline-label">{item.taskName}</div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlanningPMT;




axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
import React, { useState, useEffect } from 'react';
import './planningPMT.css';
import axios from 'axios';

// Utility to get CSRF token from cookies
const getCsrfToken = () => {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=').map(c => c.trim());
    if (key === name) return value;
  }
  return '';
};

export default function PlanningPMT() {
  const years = ['2025', '2026', '2027', '2028', '2029', '2030'];

  // Define the frontend metric structure
  const tabMetrics2 = {
    F_Nombre_de_puits_Forages: ['Wildcat', 'Délinéation'],
    F_Nombre_de_puits_Termines: ['Wildcat', 'Délinéation'],
    F_Autres: ['Métage'],
    S_2D: ['Mois-equipes', 'points vibrés', 'KM-profil', 'Traitement', 'Retraitement'],
    S_3D: ['Mois-equipes', 'points vibrés', 'KM-profil', 'Traitement', 'Retraitement'],
    E_Études: [
      'Geologie de terrain (mois-ingénieurs)',
      'Travaux de synthèse (mois-ingénieurs)',
      'gravimétrie (mois-ingénieurs)',
      'Aero-magnetometrie (km)',
    ],
    A_Fracturation_hydraulique: ['Fracturation + work over'],
    A_Core_drilling: ['Core drilling'],
  };

  // Map tabs to their main metrics
  const tabToMetrics = {
    Forage: ['F_Nombre_de_puits_Forages', 'F_Nombre_de_puits_Termines', 'F_Autres'],
    Sismique: ['S_2D', 'S_3D'],
    Études: ['E_Études'],
    Autres: ['A_Fracturation_hydraulique', 'A_Core_drilling'],
  };

  // Map frontend metric keys to PMT model measure keys
  const metricToPmtMeasure = {
    'F_Nombre_de_puits_Forages_Wildcat': 'wildcat_forés',
    'F_Nombre_de_puits_Forages_Délinéation': 'delineation_forés',
    'F_Nombre_de_puits_Termines_Wildcat': 'wildcat_terminés',
    'F_Nombre_de_puits_Termines_Délinéation': 'delineation_terminés',
    'F_Autres_Métage': 'métrage',
    'S_2D_Mois-equipes': 'mois_equipes_2d',
    'S_2D_points vibrés': 'points_vibrés_2d',
    'S_2D_KM-profil': 'km_profil_2d',
    'S_2D_Traitement': 'traitement_2d',
    'S_2D_Retraitement': 'retraitement_2d',
    'S_3D_Mois-equipes': 'mois_equipes_3d',
    'S_3D_points vibrés': 'points_vibrés_3d',
    'S_3D_KM-profil': 'km2_profil_3d',
    'S_3D_Traitement': 'traitement_3d',
    'S_3D_Retraitement': 'retraitement_3d',
    'E_Études_Geologie de terrain (mois-ingénieurs)': 'geologie_terrain',
    'E_Études_Travaux de synthèse (mois-ingénieurs)': 'travaux_synthese',
    'E_Études_gravimétrie (mois-ingénieurs)': 'gravimetrie',
    'E_Études_Aero-magnetometrie (km)': 'aero_magnetometrie',
    'A_Fracturation_hydraulique_Fracturation + work over': 'frac_work_over',
    'A_Core_drilling_Core drilling': 'core_drill',
  };

  const [activeTab, setActiveTab] = useState('Forage');
  const [perimeters, setPerimeters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerimeter, setSelectedPerimeter] = useState(null);
  const [data, setData] = useState(() => {
    const initialData = {};
    for (const mainMetric of tabToMetrics['Forage']) {
      for (const subMetric of tabMetrics2[mainMetric]) {
        const key = `${mainMetric}_${subMetric}`;
        initialData[key] = {};
        years.forEach(year => {
          initialData[key][year] = 0;
        });
      }
    }
    return initialData;
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isPerimetersLoading, setIsPerimetersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Replace with your actual token
  // const authToken = 'your-token-here';

  // Fetch perimeters on component mount
  useEffect(() => {
    const fetchPerimeters = async () => {
      setIsPerimetersLoading(true);
      try {
        const response = await fetch('/api/concessions/?names_only=true', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${authToken}`,
          },
          credentials: 'include', // Include cookies for session authentication
        });
        if (!response.ok) throw new Error('Failed to fetch perimeters');
        const perimetersData = await response.json();
        console.log('Fetched perimeters:', perimetersData); // Debug log
        setPerimeters(perimetersData);
        // Handle case where data might be objects (fallback to name)
        setSelectedPerimeter(perimetersData[0] ? (typeof perimetersData[0] === 'string' ? perimetersData[0] : perimetersData[0].name) : null);
      } catch (err) {
        setError(err.message);
        setPerimeters([]);
      } finally {
        setIsPerimetersLoading(false);
      }
    };
    fetchPerimeters();
  }, []);

  // Fetch data when the selected perimeter or tab changes
  useEffect(() => {
    if (!selectedPerimeter) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/exploration-forecasts/${encodeURIComponent(selectedPerimeter)}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }

        const fetchedData = await response.json();
        // Map backend data to frontend keys
        const mappedData = {};
        for (const mainMetric of tabToMetrics[activeTab]) {
          for (const subMetric of tabMetrics2[mainMetric]) {
            const frontendKey = `${mainMetric}_${subMetric}`;
            const pmtMeasure = metricToPmtMeasure[frontendKey];
            mappedData[frontendKey] = fetchedData[pmtMeasure] || {};
            years.forEach(year => {
              if (!(year in mappedData[frontendKey])) {
                mappedData[frontendKey][year] = 0;
              }
            });
          }
        }
        setData(mappedData);
      } catch (err) {
        setError(err.message);
        // Initialize default data if fetch fails
        const initialData = {};
        for (const mainMetric of tabToMetrics[activeTab]) {
          for (const subMetric of tabMetrics2[mainMetric]) {
            const key = `${mainMetric}_${subMetric}`;
            initialData[key] = {};
            years.forEach(year => {
              initialData[key][year] = 0;
            });
          }
        }
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPerimeter, activeTab]);

  const handleChange = (mainMetric, subMetric, year, value) => {
    const updated = { ...data };
    const key = `${mainMetric}_${subMetric}`;
    updated[key][year] = parseInt(value) || 0;
    setData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPerimeter) {
      setError('No perimeter selected');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Map frontend keys back to PMT measures for saving
      const saveData = {};
      for (const frontendKey in data) {
        const pmtMeasure = metricToPmtMeasure[frontendKey];
        if (pmtMeasure) {
          saveData[pmtMeasure] = data[frontendKey];
        }
      }

      const response = await fetch(`/api/exploration-forecasts/${encodeURIComponent(selectedPerimeter)}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include', // Include cookies for session authentication
        body: JSON.stringify({
          perimeterId: selectedPerimeter,
          data: saveData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save forecast data');
      }

      alert('Données enregistrées avec succès.');
    } catch (err) {
      setError(err.message);
      alert(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredPerimeters = perimeters.filter((perimeter) =>
    typeof perimeter === 'string' && perimeter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset data for the new tab
    const newData = {};
    for (const mainMetric of tabToMetrics[tab]) {
      for (const subMetric of tabMetrics2[mainMetric]) {
        const key = `${mainMetric}_${subMetric}`;
        newData[key] = {};
        years.forEach(year => {
          newData[key][year] = 0;
        });
      }
    }
    setData(newData);
  };

  const handlePerimeterSelect = (perimeter) => {
    setSelectedPerimeter(perimeter);
    setSidebarVisible(false);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sssidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
        <h2>Périmètres</h2>
        <div className="sssearch-container">
          <span className="sssearch-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un périmètre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sssearch-input"
            disabled={isPerimetersLoading}
          />
        </div>
        {isPerimetersLoading ? (
          <p>Chargement des périmètres...</p>
        ) : (
          <ul className="project-list">
            {filteredPerimeters.length > 0 ? (
              filteredPerimeters.map((perimeter, index) => (
                <li key={index}>
                  <button
                    className={`project-button ${selectedPerimeter === perimeter ? 'selected' : ''}`}
                    onClick={() => handlePerimeterSelect(perimeter)}
                  >
                    {perimeter}
                  </button>
                </li>
              ))
            ) : (
              <p>Aucun périmètre trouvé.</p>
            )}
          </ul>
        )}
      </aside>

      {/* Main Content */}
      <div className={`main ${sidebarVisible ? 'with-sidebar' : 'full-width'}`}>
        {/* Header */}
        <div className="hheaderr">
          <button className="menu-toggle" onClick={() => setSidebarVisible(!sidebarVisible)}>☰</button>
          <h2 className="header-title">
  Portefeuille Exploration - Planning - {selectedPerimeter || 'Sélectionnez un périmètre'}
</h2>
          <button className="save-button" onClick={handleSubmit} disabled={loading || !selectedPerimeter}>
            {loading ? 'Sauvegarde...' : '💾 Sauvegarder'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          {['Forage', 'Sismique', 'Études', 'Autres'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <form onSubmit={handleSubmit}>
            <table className="forecast-table">
              <thead>
                <tr>
                  <th className="metric-column">Rubrique</th>
                  {years.map(year => (
                    <th key={year} className="year-column">{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tabToMetrics[activeTab].map(mainMetric => (
                  <React.Fragment key={mainMetric}>
                    {/* Main Metric Row */}
                    <tr className="main-metric-row">
                      <td className="metric-column main-metric">{mainMetric.replace(/^[FSEA]_/, '')}</td>
                      {years.map(year => (
                        <td key={year} className="data-cell"></td>
                      ))}
                    </tr>
                    {/* Sub-Metrics Rows */}
                    {tabMetrics2[mainMetric].map(subMetric => (
                      <tr key={`${mainMetric}_${subMetric}`} className="sub-metric-row">
                        <td className="metric-column sub-metric">{subMetric}</td>
                        {years.map(year => (
                          <td key={year} className="data-cell">
                            <input
                              type="number"
                              value={data[`${mainMetric}_${subMetric}`]?.[year] || 0}
                              onChange={(e) => handleChange(mainMetric, subMetric, year, e.target.value)}
                              className="number-input"
                              min="0"
                              disabled={loading || !selectedPerimeter}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}