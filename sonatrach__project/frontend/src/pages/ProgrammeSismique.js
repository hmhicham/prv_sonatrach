import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Programmes.css';

const getCsrfToken = () => {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=').map(c => c.trim());
    if (key === name) return value;
  }
  return '';
};

const ProgrammeSismique = () => {
  const [activeFilter, setActiveFilter] = useState(''); // ASE, ASO, etc.
  const [sismiques, setSismiques] = useState([]);
  const [perimeters, setPerimeters] = useState([]);
  const [selectedPerimeter, setSelectedPerimeter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    prm: '',
    type: '',
    start_date: '',
    end_date: '',
    company: '',
    kilometrage: '',
    cost: '',
    activity: '',
  });

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
        // Fetch perimeters
        const perimetersResponse = await axios.get('/api/concessions/?names_only=true', {
          headers: { 'X-CSRFToken': getCsrfToken() },
          withCredentials: true,
        });
        setPerimeters(perimetersResponse.data);
        setSelectedPerimeter(perimetersResponse.data[perimetersResponse.data.length - 1] || null);

        // Fetch Sismique data
        const response = await axios.get('/api/sismiques/', {
          headers: { 'X-CSRFToken': getCsrfToken() },
          withCredentials: true,
        });
        console.log('Fetched sismiques:', response.data); // Debug the data structure
        setSismiques(response.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  let filteredData = sismiques;
  if (activeFilter) {
    filteredData = filteredData.filter((item) =>
      (item.type || item.category || '').toUpperCase() === activeFilter
    );
  }
  if (selectedPerimeter) {
    filteredData = filteredData.filter((item) => {
      const perimeterField = item.prm || item.prm?.name || item.prm;
      return perimeterField === selectedPerimeter;
    });
  }

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || '',
      prm: item.prm || '',
      type: item.type || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      company: item.company || '',
      kilometrage: item.kilometrage || '',
      cost: item.cost || '',
      activity: item.activity || '',
    });
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
    setFormData({
      name: '',
      prm: '',
      type: '',
      start_date: '',
      end_date: '',
      company: '',
      kilometrage: '',
      cost: '',
      activity: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name: formData.name,
        prm: formData.prm,
        type: formData.type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        company: formData.company,
        kilometrage: formData.kilometrage,
        cost: formData.cost,
        activity: formData.activity,
      };
      console.log('Sending update to:', `/api/sismiques/${selectedItem.id || selectedItem.name}/`);
      console.log('Updated data:', updatedData);
      const response = await axios.put(
        `/api/sismiques/${selectedItem.id || selectedItem.name}/`,
        updatedData,
        {
          headers: { 'X-CSRFToken': getCsrfToken() },
          withCredentials: true,
          credentials: 'include',
        }
      );
      console.log('Update response:', response.data);
      setSismiques(sismiques.map((item) => (item.id === selectedItem.id || item.name === selectedItem.name ? response.data : item)));
      handleModalClose();
    } catch (error) {
      setError('Failed to update seismic program. Please try again.');
      console.error('Error updating seismic program:', {
        message: error.message,
        response: error.response ? error.response.data : 'No response data',
        status: error.response ? error.response.status : 'No status',
      });
    }
  };

  const handleDelete = async (itemId) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete this seismic program? This action cannot be undone.`);
    if (!isConfirmed) {
      console.log(`Deletion of seismic program with ID ${itemId} canceled by user.`);
      alert(`Deletion was canceled.`);
      return;
    }
    try {
      const response = await axios.delete(`/api/sismiques/${itemId}/`, {
        headers: { 'X-CSRFToken': getCsrfToken() },
        withCredentials: true,
      });
      if (response.status === 204) {
        setSismiques(sismiques.filter((item) => item.id !== itemId));
        console.log(`Successfully deleted seismic program with ID ${itemId}`);
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      setError('Failed to delete seismic program. Please try again.');
      console.error('Error deleting seismic program:', {
        message: error.message,
        response: error.response ? error.response.data : 'No response data',
        status: error.response ? error.response.status : 'No status',
      });
    }
  };

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

        <h1 className="page-title">Programme Sismique</h1>

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
                  <th>Designations</th>
                  <th>Périmètre</th>
                  <th>Nom de l’étude</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Compagnie de service</th>
                  <th>Kilométrage</th>
                  <th>Coûts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id || item.name}>
                    <td>{item.activity || '-'}</td>
                    <td>{item.prm || '-'}</td>
                    <td>{item.name || '-'}</td>
                    <td>{item.start_date || '-'}</td>
                    <td>{item.end_date || '-'}</td>
                    <td>{item.company || '-'}</td>
                    <td>{item.kilometrage || '-'}</td>
                    <td>{item.cost || '-'}</td>
                    <td>
                      <button
                        className="action-buttonn edit"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-buttonn delete"
                        onClick={() => handleDelete(item.id || item.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-contentt">
            <div className="modal-header">
              <h2>Modifier le programme sismique</h2>
              <button onClick={handleModalClose} className="modal-close-button">✕</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Périmètre</label>
                <select
                  name="prm"
                  value={formData.prm}
                  onChange={handleFormChange}
                >
                  <option value="">Sélectionner</option>
                  {perimeters.map((perimeter, index) => (
                    <option key={index} value={perimeter}>
                      {perimeter}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date Début</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Date Fin</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Kilométrage</label>
                <input
                  type="number"
                  name="kilometrage"
                  value={formData.kilometrage}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Cost (KDA)</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Activity</label>
                <input
                  type="text"
                  name="activity"
                  value={formData.activity}
                  onChange={handleFormChange}
                />
              </div>
              <button type="submit" className="submit-button">
                Enregistrer les modifications
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgrammeSismique;