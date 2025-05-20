import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Programmes.css';

const ProgrammeEtudes = () => {
  const [activeFilter, setActiveFilter] = useState('');
  const [etudes, setEtudes] = useState([]);
  const [perimeters, setPerimeters] = useState([]);
  const [selectedPerimeter, setSelectedPerimeter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authToken = 'your-token-here';

  const filters = [
    { id: 'ASE', label: 'ASE' },
    { id: 'ASO', label: 'ASO' },
    { id: 'ASC', label: 'ASC' },
    { id: 'ASN', label: 'ASN' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const perimetersResponse = await axios.get('/api/concessions/?names_only=true', {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        setPerimeters(perimetersResponse.data);
        setSelectedPerimeter(perimetersResponse.data[-1] || null);

        const response = await axios.get('/api/etudes/', {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        setEtudes(response.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  let filteredData = etudes;
  if (activeFilter) {
    filteredData = filteredData.filter((item) =>
      (item.type || item.category || '').toUpperCase() === activeFilter
    );
  }
  if (selectedPerimeter) {
    filteredData = filteredData.filter((item) => {
      const perimeterField = item.perimetre || item.prm?.name || item.prm;
      return perimeterField === selectedPerimeter;
    });
  }

  return (
    <div className="programmes-container">
      <div className="programmes-wrapper">
        <div className="action-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher par nom"
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="table-header">
                <div className="table-header-actions">
            <select
              value={selectedPerimeter || ''}
              onChange={(e) => setSelectedPerimeter(e.target.value || null)}
              className="perimeter-select"
            >
              <option value="">Tous les périmètres</option>
              {perimeters.map((perimeter, index) => (
                <option key={index} value={perimeter}>
                  {perimeter}
                </option>
              ))}
            </select>
          
          
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Tous les filtres</option>
              {filters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
          </div>
          <div className="action-buttons">
            <button className="filter-buttonn">
              <span className="filter-icon">🖥️</span> Filtrer
            </button>
            <button className="new-buttonn">Nouveau</button>
          </div>
        </div>

        <h1 className="page-title">Programme Etude G&G</h1>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : !filteredData.length ? (
          <p className="no-data-text">No data available.</p>
        ) : (
          <div className="table-containerr">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Périmètre</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Company</th>
                  <th>Cost (KDA)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name || '-'}</td>
                    <td>{item.prm?.name || '-'}</td>
                    <td>{item.start_date || '-'}</td>
                    <td>{item.end_date || '-'}</td>
                    <td>{item.company || '-'}</td>
                    <td>{item.cost || '-'}</td>
                    <td>
                      <button className="action-buttonn edit">Edit</button>
                      <button className="action-buttonn delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgrammeEtudes;