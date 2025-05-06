import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Programmes.css';

const Programmes = ({ initialTab = 'ASO' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sismiques, setSismiques] = useState([]);
  const [puits, setPuits] = useState([]);
  const [etudes, setEtudes] = useState([]);
  const [fracturations, setFracturations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'ASO', label: 'Programmes sismiques', endpoint: '/api/sismiques/' },
    { id: 'ASE', label: 'Programmes puits', endpoint: '/api/puits/' },
    { id: 'ASC', label: 'Programmes Etude G&G', endpoint: '/api/etudes/' },
    { id: 'ASN', label: 'Programmes Facturation Hydraulique', endpoint: '/api/fracturation/' },
  ];

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tab = tabs.find((t) => t.id === activeTab);
        const response = await axios.get(tab.endpoint);
        if (activeTab === 'ASO') setSismiques(response.data);
        if (activeTab === 'ASE') setPuits(response.data);
        if (activeTab === 'ASC') setEtudes(response.data);
        if (activeTab === 'ASN') setFracturations(response.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const renderTable = () => {
    if (loading) return <p className="loading-text">Loading...</p>;
    if (error) return <p className="error-text">{error}</p>;

    const tab = tabs.find((t) => t.id === activeTab);
    let data = [];
    if (activeTab === 'ASO') data = sismiques;
    if (activeTab === 'ASE') data = puits;
    if (activeTab === 'ASC') data = etudes;
    if (activeTab === 'ASN') data = fracturations;

    if (!data.length) return <p className="no-data-text">No data available.</p>;

    return (
      <div className="table-containerr">
        <table className="data-table">
          <thead>
            <tr>
              {activeTab === 'ASO' && (
                <>
                  <th>Name</th>
                  <th>Périmètre</th>
                  <th>Type</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Company</th>
                  <th>Kilométrage</th>
                  <th>Cost (KDA)</th>
                  <th>Offshore</th>
                  <th>Data Quality</th>
                  <th>Actions</th>
                </>
              )}
              {activeTab === 'ASE' && (
                <>
                  <th>Sigle</th>
                  <th>Périmètre</th>
                  <th>Type</th>
                  <th>Objective</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Result</th>
                  <th>State</th>
                  <th>Cost (KDA)</th>
                  <th>Company</th>
                  <th>Offshore</th>
                  <th>Actions</th>
                </>
              )}
              {activeTab === 'ASC' && (
                <>
                  <th>Name</th>
                  <th>Périmètre</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Company</th>
                  <th>Cost (KDA)</th>
                  <th>Actions</th>
                </>
              )}
              {activeTab === 'ASN' && (
                <>
                  <th>Name</th>
                  <th>Périmètre</th>
                  <th>Well</th>
                  <th>Reservoirs</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Initial Rate</th>
                  <th>Final Rate</th>
                  <th>Company</th>
                  <th>Cost (KDA)</th>
                  <th>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {activeTab === 'ASO' && (
                  <>
                    <td>{item.nomEtude || '-'}</td>
                    <td>{item.perimetre || '-'}</td>
                    <td>{item.type || '-'}</td>
                    <td>{item.dateDebut || '-'}</td>
                    <td>{item.dateFin || '-'}</td>
                    <td>{item.compagnieService || '-'}</td>
                    <td>{item.kilometrage || '-'}</td>
                    <td>{item.couts || '-'}</td>
                    <td>{item.offshore ? 'Yes' : 'No'}</td>
                    <td>{item.dataQuality || '-'}</td>
                    <td>
                      <button className="action-buttonn edit">Edit</button>
                      <button className="action-buttonn delete">Delete</button>
                    </td>
                  </>
                )}
                {activeTab === 'ASE' && (
                  <>
                    <td>{item.sigle || '-'}</td>
                    <td>{item.prm?.name || '-'}</td>
                    <td>{item.type || '-'}</td>
                    <td>{item.objective || '-'}</td>
                    <td>{item.start_date || '-'}</td>
                    <td>{item.end_date || '-'}</td>
                    <td>{item.result || '-'}</td>
                    <td>{item.state || '-'}</td>
                    <td>{item.cost || '-'}</td>
                    <td>{item.company || '-'}</td>
                    <td>{item.offshore ? 'Yes' : 'No'}</td>
                    <td>
                      <button className="action-buttonn edit">Edit</button>
                      <button className="action-buttonn delete">Delete</button>
                    </td>
                  </>
                )}
                {activeTab === 'ASC' && (
                  <>
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
                  </>
                )}
                {activeTab === 'ASN' && (
                  <>
                    <td>{item.name || '-'}</td>
                    <td>{item.prm || '-'}</td>
                    <td>{item.well_name || '-'}</td>
                    <td>{item.reservoirs || '-'}</td>
                    <td>{item.start_date || '-'}</td>
                    <td>{item.end_date || '-'}</td>
                    <td>{item.init_rate || '-'}</td>
                    <td>{item.fin_rate || '-'}</td>
                    <td>{item.company || '-'}</td>
                    <td>{item.cost || '-'}</td>
                    <td>
                      <button className="action-buttonn edit">Edit</button>
                      <button className="action-buttonn delete">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="programmes-container">
      <div className="programmes-wrapper">
        {/* Search and Action Bar */}
        <div className="action-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher par nom"
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="action-buttons">
            <button className="filter-buttonn">
              <span className="filter-icon">🖥️</span> Filtrer
            </button>
            <button className="new-buttonn">Nouveau</button>
          </div>
        </div>

        {/* Horizontal Menu */}
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.id}
            </button>
          ))}
        </div>

        {/* Page Title */}
        <h1 className="page-title">
          {tabs.find((t) => t.id === activeTab).label}
        </h1>

        {/* Table */}
        {renderTable()}
      </div>
    </div>
  );
};

export default Programmes;