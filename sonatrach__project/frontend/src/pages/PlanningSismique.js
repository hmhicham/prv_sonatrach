// import React, { useState } from 'react';
// import './planningSismique.css';

// export default function PlaningSismique() {
//   const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
//   const metrics = ['m-eq', 'Kilometrage', 'PV', 'KDA SCI', 'KDA avec CI'];

//   // Mock seismic projects
//   const seismicProjects = [
//     'Projet Sismique A', 'Projet Sismique B', 'Projet Sismique C',
//     'Projet Sismique D', 'Projet Sismique E', 'Projet Sismique F',
//     'Projet Sismique G', 'Projet Sismique H', 'Projet Sismique I',
//     'Projet Sismique J', 'Projet Sismique K', 'Projet Sismique L',
//     'Projet Sismique M', 'Projet Sismique N', 'Projet Sismique O',
//     'Projet Sismique P', 'Projet Sismique Q', 'Projet Sismique R',
//     'Projet Sismique S', 'Projet Sismique T', 'Projet Sismique U',
//     'Projet Sismique V', 'Projet Sismique W', 'Projet Sismique X',
//     'Projet Sismique Y', 'Projet Sismique Z',
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
//   const filteredProjects = seismicProjects.filter((project) =>
//     project.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="app">
//       {/* Sidebar */}
//       <aside className={`ssidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
//         <h2>Projets Sismiques</h2>
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
//           <h2 className="header-title">Prévisions mensuelles de l'année 2025 du Sismique 24-HSN-2D</h2>
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



import React, { useState, useEffect } from 'react';
import './planningSismique.css';

// Function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function PlaningSismique() {
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
  const metrics = ['m-eq', 'Kilometrage', 'PV', 'KDA SCI', 'KDA avec CI'];

  const [seismicProjects, setSeismicProjects] = useState([]);
  const initialData = {};
  metrics.forEach(metric => {
    initialData[metric] = {};
    months.forEach(month => {
      initialData[metric][month] = 0;
    });
  });

  const [data, setData] = useState(initialData);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchSeismicPrograms = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/sismiques/');
        const result = await response.json();
        if (response.ok) {
          const projects = result.map(item => ({
            id: item.name,
            name: item.nomEtude || item.name
          }));
          setSeismicProjects(projects);
          if (projects.length > 0) {
            setSelectedProject(projects[0].id);
          }
        } else {
          console.error('Error fetching seismic programs:', result);
        }
      } catch (error) {
        console.error('Error fetching seismic programs:', error);
      }
    };
    fetchSeismicPrograms();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/forecasts/${selectedProject}/`);
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          setData(initialData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData(initialData);
      }
    };
    fetchData();
  }, [selectedProject]);

  const handleChange = (metric, month, value) => {
    const updated = { ...data };
    updated[metric][month] = parseInt(value) || 0;
    setData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/forecasts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken, // Include CSRF token
        },
        body: JSON.stringify({ projectId: selectedProject, data }),
        credentials: 'include', // Include cookies for authentication
      });
      const result = await response.json();
      if (response.ok) {
        alert('Données enregistrées avec succès !');
      } else {
        alert('Erreur lors de l\'enregistrement : ' + result.error);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Erreur serveur lors de l\'enregistrement.');
    }
  };

  const filteredProjects = seismicProjects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <aside className={`ssidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
        <h2>Projets Sismiques</h2>
        <div className="ssearch-container">
          <span className="ssearch-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher projets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ssearch-input"
          />
        </div>
        <ul className="project-list">
          {filteredProjects.map((project) => (
            <li key={project.id}>
              <button
                className="project-button"
                onClick={() => setSelectedProject(project.id)}
              >
                {project.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className={`main ${sidebarVisible ? 'with-sidebar' : 'full-width'}`}>
        <div className="hheaderr">
          <button className="menu-toggle" onClick={() => setSidebarVisible(!sidebarVisible)}>☰</button>
          <h2 className="header-title">Prévisions mensuelles de l'année 2025 du Sismique 24-HSN-2D</h2>
          <button className="save-button" onClick={handleSubmit}>💾 Sauvegarder</button>
        </div>
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
                          value={data[metric][month]}
                          onChange={(e) => handleChange(metric, month, e.target.value)}
                          className="number-input"
                          min="0"
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































// axios.defaults.xsrfCookieName = 'csrftoken';
// axios.defaults.xsrfHeaderName = 'X-CSRFToken';
// axios.defaults.withCredentials = true;
// import React, { useState, useEffect } from 'react';
// import './planningSismique.css';
// import axios from 'axios';

// // Function to get CSRF token from cookies
// function getCookie(name) {
//   let cookieValue = null;
//   if (document.cookie && document.cookie !== '') {
//     const cookies = document.cookie.split(';');
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].trim();
//       if (cookie.substring(0, name.length + 1) === (name + '=')) {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// }

// export default function PlaningSismique() {
//   const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const metrics = ['m-eq', 'Kilometrage', 'PV', 'KDA SCI', 'KDA avec CI'];

//   const [seismicProjects, setSeismicProjects] = useState([]);
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
//   const [selectedProject, setSelectedProject] = useState(null);

//   // Fetch seismic programs on component mount
//   useEffect(() => {
//     const fetchSeismicPrograms = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/api/sismiques/');
//         const result = await response.json();
//         if (response.ok) {
//           const projects = result.map(item => ({
//             id: item.name,
//             name: item.nomEtude || item.name
//           }));
//           setSeismicProjects(projects);
//           if (projects.length > 0) {
//             setSelectedProject(projects[0].id);
//           }
//         } else {
//           console.error('Error fetching seismic programs:', result);
//         }
//       } catch (error) {
//         console.error('Error fetching seismic programs:', error);
//       }
//     };
//     fetchSeismicPrograms();
//   }, []);

//   // Fetch forecast data when selected project changes
//   useEffect(() => {
//     if (!selectedProject) return;

//     const fetchData = async () => {
//       try {
//         const response = await fetch(`http://127.0.0.1:8000/api/forecasts/${selectedProject}/`);
//         const result = await response.json();
//         if (response.ok) {
//           setData(result);
//         } else {
//           setData(initialData);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setData(initialData);
//       }
//     };
//     fetchData();
//   }, [selectedProject]);

//   const handleChange = (metric, month, value) => {
//     const updated = { ...data };
//     updated[metric][month] = parseInt(value) || 0;
//     setData(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const csrfToken = getCookie('csrftoken');
//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/forecasts/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json',
//           'X-CSRFToken': csrfToken,
//          },
//         body: JSON.stringify({ projectId: selectedProject, data }),
//         credentials: 'include', // Include cookies for authentication
//       });
//       const result = await response.json();
//       if (response.ok) {
//         alert('Données enregistrées avec succès !');
//       } else {
//         alert('Erreur lors de l\'enregistrement : ' + result.error);
//       }
//     } catch (error) {
//       console.error('Error saving data:', error);
//       alert('Erreur serveur lors de l\'enregistrement.');
//     }
//   };

//   const filteredProjects = seismicProjects.filter((project) =>
//     project.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="app">
//       <aside className={`ssidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
//         <h2>Projets Sismiques</h2>
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
//           {filteredProjects.map((project) => (
//             <li key={project.id}>
//               <button
//                 className="project-button"
//                 onClick={() => setSelectedProject(project.id)}
//               >
//                 {project.name}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </aside>
//       <div className={`main ${sidebarVisible ? 'with-sidebar' : 'full-width'}`}>
//         <div className="hheaderr">
//           <button className="menu-toggle" onClick={() => setSidebarVisible(!sidebarVisible)}>☰</button>
//           <h2 className="header-title">Prévisions mensuelles de l'année 2025 du {selectedProject || 'Sélectionnez un périmètre'}

//           </h2>
//           <button className="save-button" onClick={handleSubmit}>💾 Sauvegarder</button>
//         </div>
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