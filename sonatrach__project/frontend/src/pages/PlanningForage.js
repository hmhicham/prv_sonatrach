// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './PlanningForage.css';

// // Mock data (replace with API call)
// const mockData = [
//   { id: 1, wellName: 'Well A1', startDate: '2025-05-01', endDate: '2025-05-20', depth: 3200, rigName: 'Rig 1', status: 'In Progress' },
//   { id: 2, wellName: 'Well B2', startDate: '2025-05-05', endDate: '2025-05-25', depth: 2800, rigName: 'Rig 2', status: 'In Progress' },
//   { id: 3, wellName: 'Well C3', startDate: '2025-04-15', endDate: '2025-05-01', depth: 3500, rigName: 'Rig 1', status: 'Completed' },
// ];

// const PlanningForage = () => {
//   const [data, setData] = useState(mockData);
//   const [viewMode, setViewMode] = useState('table');
//   const [monthFilter, setMonthFilter] = useState('2025-05');
//   const [rigFilter, setRigFilter] = useState('All');

//   // Filter data
//   const filteredData = data.filter((item) => {
//     const itemMonth = item.startDate.slice(0, 7);
//     const monthMatch = monthFilter === 'All' || itemMonth === monthFilter;
//     const rigMatch = rigFilter === 'All' || item.rigName === rigFilter;
//     return monthMatch && rigMatch;
//   });

//   const getTimelinePosition = (startDate, endDate) => {
//     const start = new Date(startDate).getDate();
//     const duration = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
//     return { start: start * 3, width: duration * 3 };
//   };

//   return (
//     <div className="planning-container">
//       <h1 className="planning-title">Planning Forage Mensuel</h1>

//       <div className="planning-controls">
//         <div className="filter-group">
//           <label className="filter-label">Filter by Month:</label>
//           <select
//             value={monthFilter}
//             onChange={(e) => setMonthFilter(e.target.value)}
//             className="filter-select"
//           >
//             <option value="All">All</option>
//             <option value="2025-04">April 2025</option>
//             <option value="2025-05">May 2025</option>
//             <option value="2025-06">June 2025</option>
//           </select>
//         </div>
//         <div className="filter-group">
//           <label className="filter-label">Filter by Rig:</label>
//           <select
//             value={rigFilter}
//             onChange={(e) => setRigFilter(e.target.value)}
//             className="filter-select"
//           >
//             <option value="All">All</option>
//             <option value="Rig 1">Rig 1</option>
//             <option value="Rig 2">Rig 2</option>
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
//                 <th>Well Name</th>
//                 <th>Start Date</th>
//                 <th>End Date</th>
//                 <th>Depth (m)</th>
//                 <th>Rig Name</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.wellName}</td>
//                   <td>{item.startDate}</td>
//                   <td>{item.endDate}</td>
//                   <td>{item.depth}</td>
//                   <td>{item.rigName}</td>
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
//                     <div className="timeline-label">{item.wellName}</div>
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

// export default PlanningForage;



// import React, { useState } from 'react';
// import './planningForage.css';

// export default function PlanningForage() {
//   const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
//   const metrics = ['metrage', 'M-app', 'MDA'];

//   // Mock drilling projects
//   const drillingProjects = [
//     'Projet Forage A', 'Projet Forage B', 'Projet Forage C',
//     'Projet Forage D', 'Projet Forage E', 'Projet Forage F',
//     'Projet Forage G', 'Projet Forage H', 'Projet Forage I',
//     'Projet Forage J', 'Projet Forage K', 'Projet Forage L',
//     'Projet Forage M', 'Projet Forage N', 'Projet Forage O',
//     'Projet Forage P', 'Projet Forage Q', 'Projet Forage R',
//     'Projet Forage S', 'Projet Forage T', 'Projet Forage U',
//     'Projet Forage V', 'Projet Forage W', 'Projet Forage X',
//     'Projet Forage Y', 'Projet Forage Z',
//   ];

//   const initialData = {};
//   metrics.forEach(metric => {
//     initialData[metric] = {};
//     months.forEach(month => {
//       initialData[metric][month] = 0;
//     });
//   });

//   const [data, setData] = useState(initialData);
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleChange = (metric, month, value) => {
//     const updated = { ...data };
//     updated[metric][month] = parseInt(value) || 0;
//     setData(updated);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Prévisions enregistrées :', data);
//     alert('Données enregistrées dans la console.');
//   };

//   // Filter projects based on search term
//   const filteredProjects = drillingProjects.filter((project) =>
//     project.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="app">
//       {/* Sidebar */}
//       <aside className={`ssidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
//         <h2>Projets Forage</h2>
//         <div className="ssearch-container">
//           <span className="ssearch-icon">🔍</span>
//           <input
//             type="text"
//             placeholder="Rechercher projets..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="ssearch-input"
//           />
//         </div>
//         <ul className="project-list">
//           {filteredProjects.map((project, index) => (
//             <li key={index}>
//               <button className="project-button">{project}</button>
//             </li>
//           ))}
//         </ul>
//       </aside>

//       {/* Main Content */}
//       <div className={`main ${sidebarVisible ? 'with-sidebar' : 'full-width'}`}>
//         {/* Header */}
//         <div className="hheaderr">
//           <button className="menu-toggle" onClick={() => setSidebarVisible(!sidebarVisible)}>☰</button>
//           <h2 className="header-title">Prévisions mensuelles de l'année 2025 du Forage 24-HSN-2D</h2>
//           <button className="save-button" onClick={handleSubmit}>💾 Sauvegarder</button>
//         </div>

//         {/* Table */}
//         <div className="table-wrapper">
//           <form onSubmit={handleSubmit}>
//             <table className="forecast-table">
//               <thead>
//                 <tr>
//                   <th className="metric-column">Métrique</th>
//                   {months.map(month => (
//                     <th key={month} className="month-column">{month}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {metrics.map(metric => (
//                   <tr key={metric}>
//                     <td className="metric-column">{metric}</td>
//                     {months.map(month => (
//                       <td key={month} className="data-cell">
//                         <input
//                           type="number"
//                           value={data[metric][month]}
//                           onChange={(e) => handleChange(metric, month, e.target.value)}
//                           className="number-input"
//                           min="0"
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
import React, { useState, useEffect } from 'react';
import './planningForage.css';
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

export default function PlanningForage() {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const metrics = ['metrage', 'M-app', 'MDA'];

  const [data, setData] = useState({});
  const [drillingProjects, setDrillingProjects] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true); // New state for project loading

  // Fetch drilling projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsProjectsLoading(true);
      try {
        const response = await fetch('/api/wells/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for session authentication
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        const projects = await response.json();
        setDrillingProjects(projects);
        setSelectedProject(projects[0] || null);
      } catch (err) {
        setError(err.message);
        setDrillingProjects([]);
      } finally {
        setIsProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch data when the selected project changes
  useEffect(() => {
    if (!selectedProject) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/drilling-forecasts/${encodeURIComponent(selectedProject)}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for session authentication
        });

        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }

        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (err) {
        setError(err.message);
        const initialData = {};
        metrics.forEach(metric => {
          initialData[metric] = {};
          months.forEach(month => {
            initialData[metric][month] = 0;
          });
        });
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProject]);

  // Handle input changes in the table
  const handleChange = (metric, month, value) => {
    const updated = { ...data };
    updated[metric][month] = parseInt(value) || 0;
    setData(updated);
  };

  // Handle form submission to save data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) {
      setError('No project selected');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/drilling-forecasts/${encodeURIComponent(selectedProject)}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include', // Include cookies for session authentication
        body: JSON.stringify({
          projectId: selectedProject,
          data: data,
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

  // Handle project selection from the sidebar
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setSidebarVisible(false);
  };

  // Filter projects based on search term with safeguard
  const filteredProjects = drillingProjects.filter((project) =>
    typeof project === 'string' && project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`ssidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
        <h2>Projets Forage</h2>
        <div className="ssearch-container">
          <span className="ssearch-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher projets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ssearch-input"
            disabled={isProjectsLoading}
          />
        </div>
        {isProjectsLoading ? (
          <p>Chargement des projets...</p>
        ) : (
          <ul className="project-list">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <li key={index}>
                  <button
                    className={`project-button ${selectedProject === project ? 'selected' : ''}`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    {project}
                  </button>
                </li>
              ))
            ) : (
              <p>Aucun projet trouvé.</p>
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
            Prévisions mensuelles de l'année 2025 du Forage - {selectedProject || 'Sélectionnez un projet'}
          </h2>
          <button className="save-button" onClick={handleSubmit} disabled={loading || !selectedProject}>
            {loading ? 'Sauvegarde...' : '💾 Sauvegarder'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="table-wrapper">
          <form onSubmit={handleSubmit}>
            <table className="forecast-table">
              <thead>
                <tr>
                  <th className="metric-column">Métrique</th>
                  {months.map(month => (
                    <th key={month} className="month-column">{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map(metric => (
                  <tr key={metric}>
                    <td className="metric-column">{metric}</td>
                    {months.map(month => (
                      <td key={month} className="data-cell">
                        <input
                          type="number"
                          value={data[metric]?.[month] || 0}
                          onChange={(e) => handleChange(metric, month, e.target.value)}
                          className="number-input"
                          min="0"
                          disabled={loading || !selectedProject}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}