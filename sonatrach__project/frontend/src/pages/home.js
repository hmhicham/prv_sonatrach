// // import React from 'react';
// // import './Home.css';

// // function Home() {
// //   return (
// //     <div className="home">
// //       <h1>Bienvenue sur la plateforme Sonatrach</h1>
// //       <div className="toolbar">
// //         <input type="text" placeholder="Rechercher..." />
// //         <select>
// //           <option>Filtrer par</option>
// //           <option>Date</option>
// //           <option>Type</option>
// //         </select>
// //       </div>
// //       <div className="map-toolbar">
// //         <button>Zoom +</button>
// //         <button>Zoom -</button>
// //         <button>Centrer la carte</button>
// //       </div>
// //       <div className="content">
// //         <p>Contenu principal ici...</p>
// //       </div>
// //     </div>
// //   );
// // }
// // --------------------------------------------------------------


// // export default Home;
// import React, { useEffect, Suspense } from 'react';

// const MapComponent = React.lazy(() => import('./MapComponent'));
// const styles = `
//   .home-container {
//     padding: 2rem;
//     max-width: 1200px;
//     margin: 0 auto;
//   }

//   .home-header {
//     text-align: center;
//     margin-bottom: 2rem;
//   }

//   .map-container {
//     height: 600px;
//     border-radius: 10px;
//     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//     margin-top: 2rem;
//   }
// `;


// function Home() {
//   return (
//     <div className="home-container">
//       <div className="home-header">
//         <h1 className="text-4xl font-bold mb-4">Bienvenue sur le Système de Suivi des Opérations</h1>
//         <p className="text-xl text-gray-600 mb-8">Visualisation des activités pétrolières en Algérie</p>
//       </div>
//       <Suspense fallback={<div>Loading map...</div>}>
//         <MapComponent />
//       </Suspense>
//     </div>
//   );
// }

// export default Home;



// // import React, { useState, useRef } from 'react';
// // import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents } from 'react-leaflet';
// // import L from 'leaflet';
// // import './Home.css';

// // function Home() {
// //   const [layers, setLayers] = useState({
// //     perimetres: false,
// //     bassinsGeologiques: false,
// //     surfacesRendues: false,
// //     departements: false,
// //     wilaya: false,
// //     blocs: false,
// //     puits: false,
// //     sismique2D: false,
// //     sismique3D: false,
// //     volumes: false,
// //     pipelines: false,
// //     champsCollecteurs: false,
// //   });

// //   const [showLegend, setShowLegend] = useState(false);
// //   const [measureDistance, setMeasureDistance] = useState(false);
// //   const [selectZone, setSelectZone] = useState(false);
// //   const [coordinates, setCoordinates] = useState([]);
// //   const [showCoordinateInput, setShowCoordinateInput] = useState(false);
// //   const [lat, setLat] = useState('');
// //   const [lng, setLng] = useState('');
// //   const [drawnShapes, setDrawnShapes] = useState([]);

// //   const mapRef = useRef();

// //   const perimeters = [
// //     { name: 'Perimeter 1', positions: [[36.5, 3], [36.5, 4], [35.5, 4], [35.5, 3]] },
// //     { name: 'Perimeter 2', positions: [[34.5, 2], [34.5, 3], [33.5, 3], [33.5, 2]] },
// //   ];

// //   const toggleLayer = (layer) => {
// //     setLayers({ ...layers, [layer]: !layers[layer] });
// //   };

// //   const MeasureDistance = () => {
// //     const map = useMapEvents({
// //       click(e) {
// //         if (measureDistance) {
// //           const newCoords = [...coordinates, [e.latlng.lat, e.latlng.lng]];
// //           if (newCoords.length === 2) {
// //             setMeasureDistance(false);
// //           }
// //           setCoordinates(newCoords);
// //         }
// //       },
// //     });
// //     return null;
// //   };

// //   const SelectZone = () => {
// //     const map = useMapEvents({
// //       click(e) {
// //         if (selectZone) {
// //           const newCoords = [...coordinates, [e.latlng.lat, e.latlng.lng]];
// //           if (newCoords.length === 4) {
// //             setSelectZone(false);
// //             setDrawnShapes([...drawnShapes, newCoords]);
// //           }
// //           setCoordinates(newCoords);
// //         }
// //       },
// //     });
// //     return null;
// //   };

// //   const calculateDistance = (coords) => {
// //     if (coords.length !== 2) return 0;
// //     const [lat1, lon1] = coords[0];
// //     const [lat2, lon2] = coords[1];
// //     const R = 6371;
// //     const dLat = ((lat2 - lat1) * Math.PI) / 180;
// //     const dLon = ((lon2 - lon1) * Math.PI) / 180;
// //     const a =
// //       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// //       Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
// //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// //     return (R * c).toFixed(2);
// //   };

// //   const addShapeFromCoordinates = () => {
// //     if (lat && lng) {
// //       const newCoord = [parseFloat(lat), parseFloat(lng)];
// //       const newCoords = [...coordinates, newCoord];
// //       if (newCoords.length === 4) {
// //         setDrawnShapes([...drawnShapes, newCoords]);
// //         setCoordinates([]);
// //         setShowCoordinateInput(false);
// //       } else {
// //         setCoordinates(newCoords);
// //       }
// //       setLat('');
// //       setLng('');
// //     }
// //   };

// //   return (
// //     <div className="home-container">
// //       <div className="sidebar">
// //         <h2>Couches</h2>
// //         {Object.keys(layers).map((layer) => (
// //           <div key={layer} className="layer-item">
// //             <input
// //               type="checkbox"
// //               checked={layers[layer]}
// //               onChange={() => toggleLayer(layer)}
// //             />
// //             <span>{layer.charAt(0).toUpperCase() + layer.slice(1)}</span>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="map-container">
// //         <MapContainer
// //           center={[36, 3]}
// //           zoom={5}
// //           style={{ height: '100%', width: '100%' }}
// //           ref={mapRef}
// //         >
// //           <TileLayer
// //             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //           />

// //           {layers.perimetres &&
// //             perimeters.map((perimeter, index) => (
// //               <Polygon key={index} positions={perimeter.positions} color="#006633">
// //                 <Popup>{perimeter.name}</Popup>
// //               </Polygon>
// //             ))}

// //           {measureDistance && <MeasureDistance />}
// //           {coordinates.length === 2 && (
// //             <>
// //               <Marker position={coordinates[0]} />
// //               <Marker position={coordinates[1]}>
// //                 <Popup>{`Distance: ${calculateDistance(coordinates)} km`}</Popup>
// //               </Marker>
// //               <Polygon positions={coordinates} color="green" />
// //             </>
// //           )}

// //           {selectZone && <SelectZone />}
// //           {drawnShapes.map((shape, index) => (
// //             <Polygon key={index} positions={shape} color="cyan" />
// //           ))}

// //           <div className="tools">
// //             <button
// //               onClick={() => {
// //                 setSelectZone(true);
// //                 setMeasureDistance(false);
// //                 setCoordinates([]);
// //               }}
// //               className="tool-button"
// //               title="Sélectionner une zone"
// //             >
// //               🖌️
// //             </button>
// //             <button
// //               onClick={() => {
// //                 setMeasureDistance(true);
// //                 setSelectZone(false);
// //                 setCoordinates([]);
// //               }}
// //               className="tool-button"
// //               title="Mesurer une distance"
// //             >
// //               📏
// //             </button>
// //             <button
// //               onClick={() => setShowLegend(!showLegend)}
// //               className="tool-button"
// //               title="Afficher la légende"
// //             >
// //               🗺️
// //             </button>
// //             <button
// //               onClick={() => setShowCoordinateInput(true)}
// //               className="tool-button"
// //               title="Entrer des coordonnées"
// //             >
// //               ✅
// //             </button>
// //           </div>

// //           {showLegend && (
// //             <div className="legend-panel">
// //               <h3>Légende</h3>
// //               <ul>
// //                 <li>PRM: &lt;nom prm&gt; - pour rechercher un périmètre. e.g: PRM_AHARA</li>
// //                 <li>BLC: &lt;numéro&gt; - pour rechercher un bloc</li>
// //                 <li>WELL: &lt;nom du puits&gt; - pour rechercher un puits</li>
// //                 <li>2D: &lt;nom de l’étude&gt; - pour rechercher une activité sismique 2D</li>
// //                 <li>3D: &lt;nom de l’étude&gt; - pour rechercher une activité sismique 3D</li>
// //                 <li>D: &lt;nom du département&gt; - pour rechercher un département</li>
// //               </ul>
// //             </div>
// //           )}

// //           {showCoordinateInput && (
// //             <div className="coordinate-modal">
// //               <div className="modal-content">
// //                 <div className="modal-header">
// //                   <h2>Entrer des coordonnées</h2>
// //                   <button onClick={() => setShowCoordinateInput(false)}>✕</button>
// //                 </div>
// //                 <div className="form-group">
// //                   <label>Latitude</label>
// //                   <input
// //                     type="number"
// //                     value={lat}
// //                     onChange={(e) => setLat(e.target.value)}
// //                     placeholder="e.g., 36.5"
// //                   />
// //                 </div>
// //                 <div className="form-group">
// //                   <label>Longitude</label>
// //                   <input
// //                     type="number"
// //                     value={lng}
// //                     onChange={(e) => setLng(e.target.value)}
// //                     placeholder="e.g., 3.0"
// //                   />
// //                 </div>
// //                 <button onClick={addShapeFromCoordinates} className="add-button">
// //                   Ajouter le point
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </MapContainer>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;

// --------------------------------

// import React, { useState, useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, Polygon, useMap, Popup, Marker, Polyline } from 'react-leaflet';
// import L from 'leaflet';
// import axios from 'axios';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet.pm/dist/leaflet.pm.css';
// import 'leaflet.pm';
// import './Home.css';
// import { username } from '../components/App';
// axios.defaults.withCredentials = true;

// // Fix for Leaflet marker icons in React
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });

// // Algeria boundary coordinates (simplified polygon)
// const algeriaBoundary = [
//   [37.5, -1.5], [37.5, 8.5], [34.5, 8.5], [31.5, 8.5], [31.5, 2.5],
//   [27.5, 2.5], [27.5, -1.5], [29.5, -5.5], [33.5, -8.5], [37.5, -1.5],
// ];

// function MapControls({ onCenterMap }) {
//   const map = useMap();

//   if (!map) {
//     console.warn('MapControls: Map instance is not available');
//     return null;
//   }

//   const handleZoomIn = () => {
//     map.zoomIn();
//   };

//   const handleZoomOut = () => {
//     map.zoomOut();
//   };

//   return (
//     <div className="map-controls">
//       <button
//         onClick={handleZoomIn}
//         className="map-control-button"
//         title="Zoom In"
//         aria-label="Zoom In"
//       >
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//         </svg>
//       </button>
//       <button
//         onClick={handleZoomOut}
//         className="map-control-button"
//         title="Zoom Out"
//         aria-label="Zoom Out"
//       >
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16" />
//         </svg>
//       </button>
//       <button
//         onClick={onCenterMap}
//         className="map-control-button"
//         title="Center Map"
//         aria-label="Center Map"
//       >
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12h-6m-3-9v6m-9 3h6m3 9v-6" />
//         </svg>
//       </button>
//     </div>
//   );
// }

// function DrawPolygon({ onCreated, entityType }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!map) {
//       console.warn('DrawPolygon: Map instance is not available');
//       return;
//     }

//     map.pm.addControls({
//       position: 'topright',
//       drawPolygon: entityType !== 'WELL',
//       drawMarker: entityType === 'WELL',
//       drawPolyline: false,
//       drawRectangle: false,
//       drawCircle: false,
//       drawCircleMarker: false,
//       editMode: false,
//       dragMode: false,
//       cutPolygon: false,
//       removalMode: false,
//     });

//     map.on('pm:create', (e) => {
//       if (e.shape === 'Polygon') {
//         const layer = e.layer;
//         let latlngs = layer.getLatLngs()[0].map((latlng) => [latlng.lat, latlng.lng]);
//         // Ensure the polygon is closed (first and last points are the same)
//         if (latlngs.length >= 3 && (latlngs[0][0] !== latlngs[latlngs.length - 1][0] || latlngs[0][1] !== latlngs[latlngs.length - 1][1])) {
//           latlngs.push(latlngs[0]);  // Close the polygon
//         }
//         onCreated(latlngs);
//         console.log('Polygon drawn:', latlngs);
//       } else if (e.shape === 'Marker') {
//         const latlng = e.marker.getLatLng();
//         const point = [latlng.lat, latlng.lng];
//         onCreated(point);
//         console.log('Marker drawn:', point);
//       }
//     });

//     return () => {
//       map.pm.removeControls();
//       map.off('pm:create');
//     };
//   }, [map, onCreated, entityType]);

//   return null;
// }

// function Home({ username, isManager }) {
//   const [layers, setLayers] = useState({
//     perimetres: true,
//     blocs: false,
//     puits: false,
//     sismique2D: false,
//     sismique3D: false,
//   });
//   const [showLegend, setShowLegend] = useState(false);
//   const [showCoordinateInput, setShowCoordinateInput] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [lat, setLat] = useState('');
//   const [lng, setLng] = useState('');
//   const [coordinates, setCoordinates] = useState([]);
//   const [drawnShapes, setDrawnShapes] = useState([]);
//   const [currentShape, setCurrentShape] = useState(null);
//   const [entityType, setEntityType] = useState('');
//   const [formData, setFormData] = useState({});
//   const [searchQuery, setSearchQuery] = useState('');
//   const [concessions, setConcessions] = useState([]);
//   const [blocs, setBlocs] = useState([]);
//   const [wells, setWells] = useState([]);
//   const [seismic2D, setSeismic2D] = useState([]);
//   const [seismic3D, setSeismic3D] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const mapRef = useRef();
//   const [subordinates, setSubordinates] = useState([]);

//   useEffect(() => {
//     const getCsrfToken = () => {

//       const name = 'csrftoken=';

//       const decodedCookie = decodeURIComponent(document.cookie);

//       const ca = decodedCookie.split(';');

//       for (let i = 0; i < ca.length; i++) {

//         let c = ca[i].trim();

//         if (c.indexOf(name) === 0) return c.substring(name.length, c.length);

//       }

//       return '';

//     };

//     axios.defaults.headers.common['X-CSRFToken'] = getCsrfToken();


//     const fetchData = async () => {
//       try {
//         const [concessionsRes, blocsRes, wellsRes, seismic2dRes, seismic3dRes] = await Promise.all([
//           axios.get('http://localhost:8000/api/map/concessions/', { withCredentials: true }),
//           axios.get('http://localhost:8000/api/map/blocs/', { withCredentials: true }),
//           axios.get('http://localhost:8000/api/map/wells/', { withCredentials: true }),
//           axios.get('http://localhost:8000/api/map/seismic/', { params: { type: '2D' }, withCredentials: true }),
//           axios.get('http://localhost:8000/api/map/seismic/', { params: { type: '3D' }, withCredentials: true }),
//         ]);

//         setConcessions(concessionsRes.data);
//         setBlocs(blocsRes.data);
//         setWells(wellsRes.data);
//         setSeismic2D(seismic2dRes.data);
//         setSeismic3D(seismic3dRes.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     const fetchSubordinates = async () => {

//       if (isManager) {

//         try {

//           const response = await axios.get('http://localhost:8000/api/subordinates/', {

//             withCredentials: true,

//           });

//           setSubordinates(response.data);

//         } catch (error) {

//           console.error('Error fetching subordinates:', error);

//         }

//       }

//     };

//     fetchData();
//     fetchSubordinates();

//   }, [isManager]);

//   const toggleLayer = (layer) => {
//     setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
//   };

//   const handleCenterMap = () => {
//     const map = mapRef.current;
//     if (map) {
//       map.setView([33.5, 2.5], 5);
//     } else {
//       console.warn('handleCenterMap: Map instance is not available');
//     }
//   };

//   const handleDrawCreated = (latlngs) => {
//     if (!latlngs) {
//       console.error('Invalid latlngs:', latlngs);
//       return;
//     }

//     if (entityType === 'WELL') {
//       if (!Array.isArray(latlngs) || latlngs.length !== 2 || typeof latlngs[0] !== 'number' || typeof latlngs[1] !== 'number') {
//         console.error('Invalid point for WELL:', latlngs);
//         return;
//       }
//     } else {
//       if (!Array.isArray(latlngs) || latlngs.length === 0 || !latlngs.every(coord => Array.isArray(coord) && coord.length === 2)) {
//         console.error('Invalid coordinate format in latlngs:', latlngs);
//         return;
//       }
//     }
//     console.log('Setting currentShape:', latlngs);

//     setCurrentShape(latlngs);
//     setShowDetailsModal(true);
//   };

//   const addShapeFromCoordinates = () => {
//     if (!lat || !lng) {
//       console.error('Latitude or Longitude is empty');
//       return;
//     }

//     const parsedLat = parseFloat(lat);
//     const parsedLng = parseFloat(lng);

//     if (isNaN(parsedLat) || isNaN(parsedLng)) {
//       console.error('Invalid Latitude or Longitude:', lat, lng);
//       return;
//     }

//     const newCoord = [parsedLat, parsedLng];

//     if (entityType === 'WELL') {
//       setCurrentShape(newCoord);
//       setCoordinates([]);
//       setShowCoordinateInput(false);
//       setShowDetailsModal(true);
//       console.log('Point added for WELL:', newCoord);
//     } else {
//       const newCoords = [...coordinates, newCoord];
//       if (newCoords.length === 4) {
//         setCurrentShape(newCoords);
//         setCoordinates([]);
//         setShowCoordinateInput(false);
//         setShowDetailsModal(true);
//         console.log('Polygon added via coordinates:', newCoords);
//       } else {
//         setCoordinates(newCoords);
//       }
//     }

//     setLat('');
//     setLng('');
//   };

//   const handleSavePolygon = async () => {
//     if (!entityType) {
//       console.error('Entity type is not selected');
//       alert('Please select an entity type');
//       return;
//     }
  
//     if (!currentShape) {
//       console.error('No shape to save');
//       alert('No shape to save');
//       return;
//     }
  
//     if (entityType === 'WELL') {
//       if (!Array.isArray(currentShape) || currentShape.length !== 2 || typeof currentShape[0] !== 'number' || typeof currentShape[1] !== 'number') {
//         console.error('Invalid point for WELL:', currentShape);
//         alert('Invalid coordinates for Well. Please provide a single [lat, lng] point.');
//         return;
//       }
//     } else {
//       if (!Array.isArray(currentShape) || currentShape.length === 0 || !currentShape.every(coord => Array.isArray(coord) && coord.length === 2)) {
//         console.error('Invalid shape for entityType:', entityType, currentShape);
//         alert('Invalid shape. Please draw a valid polygon.');
//         return;
//       }
//     }
  
//     const payload = {
//       entity_type: entityType,
//       data: {
//         ...formData,
//         ...(entityType === 'WELL' ? { position: currentShape } : { positions: currentShape }),
//       },
//     };
  
//     try {
//       console.log('Payload being sent:', payload);
//       const response = await axios.post('http://localhost:8000/api/save-polygon/', payload, {

//         withCredentials: true,

//         headers: {

//           'X-CSRFToken': axios.defaults.headers.common['X-CSRFToken'] || '',

//         },

//       });

//       console.log('Entity saved:', response.data);
//       const { positions } = response.data;  // Get positions from the response
//       if (positions && Array.isArray(positions)) {
//         setDrawnShapes((prev) => [...prev, positions]);  // Use positions from response
//       } else {
//         console.warn('No valid positions in response, using currentShape:', currentShape);
//         setDrawnShapes((prev) => [...prev, currentShape]);  // Fallback to currentShape
//       }
  
//       // Refresh the relevant data
//       if (entityType === 'PRM') {
//         const concessionsRes = await axios.get('http://localhost:8000/api/map/concessions/', { withCredentials: true });
//         console.log('Updated concessions:', concessionsRes.data);
//         setConcessions(concessionsRes.data);
//       } else if (entityType === 'BLC') {
//         const blocsRes = await axios.get('http://localhost:8000/api/map/blocs/', { withCredentials: true });
//         console.log('Updated blocs:', blocsRes.data);
//         setBlocs(blocsRes.data);
//       } else if (entityType === 'WELL') {
//         const wellsRes = await axios.get('http://localhost:8000/api/map/wells/', { withCredentials: true });
//         console.log('Updated wells:', wellsRes.data);
//         setWells(wellsRes.data);
//       } else if (entityType === '2D') {
//         const seismic2dRes = await axios.get('http://localhost:8000/api/map/seismic/', { params: { type: '2D' }, withCredentials: true });
//         console.log('Updated seismic2D:', seismic2dRes.data);
//         setSeismic2D(seismic2dRes.data);
//       } else if (entityType === '3D') {
//         const seismic3dRes = await axios.get('http://localhost:8000/api/map/seismic/', { params: { type: '3D' }, withCredentials: true });
//         console.log('Updated seismic3D:', seismic3dRes.data);
//         setSeismic3D(seismic3dRes.data);
//       }
  
//       setShowDetailsModal(false);
//       setCurrentShape(null);
//       setFormData({});
//       setEntityType('');
//     } catch (error) {
//       console.error('Error saving entity:', error.response?.data || error.message);
//       alert('Failed to save entity: ' + (error.response?.data?.error || 'Authentication or server error. Please log in again.'));

//       if (error.response?.status === 401) {

//         window.location.href = 'http://127.0.0.1:8000/login/';

//       }
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchQuery) return;

//     try {
//       const response = await axios.get('http://localhost:8000/api/search/', {
//         params: { query: searchQuery },
//         withCredentials: true,
//       });
//       setSearchResults(response.data);
//       console.log('Search results:', response.data);

//       if (response.data.length > 0) {
//         const result = response.data[0];
//         const map = mapRef.current;
//         if (map && result.position) {
//           map.setView(result.position, 10);
//         } else if (map && result.positions) {
//           map.fitBounds(result.positions);
//         }
//       }
//     } catch (error) {
//       console.error('Search error:', error);
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };


//   const handleLogout = () => {
//     fetch('http://127.0.0.1:8000/logout/', {
//     method: 'GET',
//     credentials: 'include', // Include cookies (sessionid) in the request
//     })
//     .then(() => {
//     window.location.href = 'http://127.0.0.1:8000/login/';
//     })
//     .catch(error => {
//     console.error('Error logging out:', error);
//     });
//     };

//   return (
//     <div>
//       <header>
// <div className="container">
// <h1>Plateforme Sonatrach</h1>
// <p>Bienvenue, {username} | <button onClick={handleLogout}>Déconnexion</button>

// {isManager && (

//   <>

//     {' | '}

//     <span>Manager</span>

//     {subordinates.length > 0 ? (

//       <span> (Subordinates: {subordinates.map(sub => sub.username).join(', ')})</span>

//     ) : (

//       <span> (No subordinates)</span>

//     )}

//   </>

// )}

// </p>

// </div>
// </header>

//       <main>
//         <div className="container">
//           <div className="toolbar">
//             <div className="search-container">
//               <input
//                 type="text"
//                 placeholder="Rechercher (e.g., PRM:REGGANE II, BLC:337, ...)"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-input"
//               />
//               <span className="search-icon">
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </span>
//               <button onClick={handleSearch} className="search-button">
//                 Rechercher
//               </button>
//             </div>

//             <div className="layer-toggles">
//               {Object.keys(layers).map((layer) => (
//                 <label key={layer} className="layer-toggle">
//                   <input
//                     type="checkbox"
//                     checked={layers[layer]}
//                     onChange={() => toggleLayer(layer)}
//                   />
//                   <span>{layer}</span>
//                 </label>
//               ))}
//             </div>

//             <button
//               onClick={() => setShowLegend(!showLegend)}
//               className="legend-button"
//             >
//               {showLegend ? 'Masquer la légende' : 'Afficher la légende'}
//             </button>
//           </div>

//           <div className="map-container">
//             <MapContainer
//               center={[33.5, 2.5]}
//               zoom={5}
//               style={{ height: '600px', width: '100%' }}
//               whenCreated={(map) => {
//                 mapRef.current = map;
//                 console.log('MapContainer: Map instance created', map);
//               }}
//               className="map"
//             >
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               />

//               {/* <Polygon positions={algeriaBoundary} pathOptions={{ color: '#006633', fillOpacity: 0.1 }} /> */}

//               {layers.perimetres &&
//                 concessions
//                   .filter(concession =>
//                     concession.positions &&
//                     Array.isArray(concession.positions) &&
//                     concession.positions.length > 0 &&
//                     concession.positions.every(coord => Array.isArray(coord) && coord.length === 2)
//                   )
//                   .map((concession) => (
//                     <Polygon
//                       key={concession.name}
//                       positions={concession.positions}
//                       pathOptions={{ color: '#FF9800' }}
//                     >
//                       <Popup>
//                         <div>{concession.name}</div>
//                       </Popup>
//                     </Polygon>
//                   ))}

//               {layers.blocs &&
//                 blocs
//                   .filter(bloc =>
//                     bloc.positions &&
//                     Array.isArray(bloc.positions) &&
//                     bloc.positions.length > 0 &&
//                     bloc.positions.every(coord => Array.isArray(coord) && coord.length === 2)
//                   )
//                   .map((bloc) => (
//                     <Polygon
//                       key={bloc.id}
//                       positions={bloc.positions}
//                       pathOptions={{ color: '#2196F3' }}
//                     >
//                       <Popup>
//                         <div>{bloc.id}</div>
//                       </Popup>
//                     </Polygon>
//                   ))}

//               {layers.puits &&
//                 wells
//                   .filter(well =>
//                     well.position &&
//                     Array.isArray(well.position) &&
//                     well.position.length === 2
//                   )
//                   .map((well) => (
//                     <Marker key={well.sigle} position={well.position}>
//                       <Popup>
//                         <div>{well.sigle}</div>
//                       </Popup>
//                     </Marker>
//                   ))}

//               {layers.sismique2D &&
//                 seismic2D
//                   .filter(seismic =>
//                     seismic.positions &&
//                     Array.isArray(seismic.positions) &&
//                     seismic.positions.length > 0 &&
//                     seismic.positions.every(coord => Array.isArray(coord) && coord.length === 2)
//                   )
//                   .map((seismic) => (
//                     <Polyline
//                       key={seismic.nom_etude}
//                       positions={seismic.positions}
//                       pathOptions={{ color: '#FF0000' }}
//                     >
//                       <Popup>
//                         <div>{seismic.nom_etude}</div>
//                       </Popup>
//                     </Polyline>
//                   ))}

//               {layers.sismique3D &&
//                 seismic3D
//                   .filter(seismic =>
//                     seismic.positions &&
//                     Array.isArray(seismic.positions) &&
//                     seismic.positions.length > 0 &&
//                     seismic.positions.every(coord => Array.isArray(coord) && coord.length === 2)
//                   )
//                   .map((seismic) => (
//                     <Polygon
//                       key={seismic.nom_etude}
//                       positions={seismic.positions}
//                       pathOptions={{ color: '#00FF00' }}
//                     >
//                       <Popup>
//                         <div>{seismic.nom_etude}</div>
//                       </Popup>
//                     </Polygon>
//                   ))}

//               {drawnShapes.map((shape, index) => (
//                 shape && Array.isArray(shape) && shape.length > 0 && shape.every(coord => Array.isArray(coord) && coord.length === 2) ? (
//                   <Polygon key={index} positions={shape} pathOptions={{ color: 'cyan' }} />
//                 ) : null
//               ))}

//               <DrawPolygon onCreated={handleDrawCreated} entityType={entityType} />
//               <MapControls onCenterMap={handleCenterMap} />
//             </MapContainer>

//             <button
//               onClick={() => setShowCoordinateInput(true)}
//               className="draw-polygon-button"
//             >
//               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m3-3v6m6 6H6a3 3 0 01-3-3V6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3z" />
//               </svg>
//               Dessiner un polygone
//             </button>

//             {showLegend && (
//               <div className="legend-panel">
//                 <h3>Légende de recherche</h3>
//                 <ul>
//                   <li><span>PRM:</span> {`<nom prm>`} - Rechercher un périmètre (e.g., PRM:REGGANE II)</li>
//                   <li><span>BLC:</span> {`<numéro>`} - Rechercher un bloc (e.g., BLC:337)</li>
//                   <li><span>WELL:</span> {`<nom du puits>`} - Rechercher un puits</li>
//                   <li><span>2D:</span> {`<nom de l'étude>`} - Rechercher une activité sismique 2D</li>
//                   <li><span>3D:</span> {`<nom de l'étude>`} - Rechercher une activité sismique 3D</li>
//                   <li><span>D:</span> {`<nom du département>`} - Rechercher un département</li>
//                 </ul>
//               </div>
//             )}

//             {showCoordinateInput && (
//               <div className="modal-overlay">
//                 <div className="modal">
//                   <div className="modal-header">
//                     <h2>Entrer des coordonnées</h2>
//                     <button
//                       onClick={() => setShowCoordinateInput(false)}
//                       className="modal-close-button"
//                       aria-label="Close Modal"
//                     >
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                   <div className="modal-field">
//                     <label>Entity Type</label>
//                     <select
//                       value={entityType}
//                       onChange={(e) => setEntityType(e.target.value)}
//                     >
//                       <option value="">Select Type</option>
//                       <option value="PRM">Perimeter (PRM)</option>
//                       <option value="BLC">Block (BLC)</option>
//                       <option value="WELL">Well (WELL)</option>
//                       <option value="2D">Seismic 2D</option>
//                       <option value="3D">Seismic 3D</option>
//                     </select>
//                   </div>
//                   {entityType && (
//                     <>
//                       <div className="modal-field">
//                         <label>Latitude</label>
//                         <input
//                           type="number"
//                           step="any"
//                           value={lat}
//                           onChange={(e) => setLat(e.target.value)}
//                           placeholder="e.g., 34.5"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Longitude</label>
//                         <input
//                           type="number"
//                           step="any"
//                           value={lng}
//                           onChange={(e) => setLng(e.target.value)}
//                           placeholder="e.g., 2.0"
//                         />
//                       </div>
//                       <button
//                         onClick={addShapeFromCoordinates}
//                         className="modal-button"
//                       >
//                         Ajouter le point {entityType === 'WELL' ? '' : `(${coordinates.length + 1}/4)`}
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}

//             {showDetailsModal && (
//               <div className="modal-overlay">
//                 <div className="modal">
//                   <div className="modal-header">
//                     <h2>Enter Entity Details</h2>
//                     <button
//                       onClick={() => {
//                         setShowDetailsModal(false);
//                         setCurrentShape(null);
//                         setFormData({});
//                         setEntityType('');
//                       }}
//                       className="modal-close-button"
//                       aria-label="Close Modal"
//                     >
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                   <div className="modal-field">
//                     <label>Entity Type</label>
//                     <select
//                       value={entityType}
//                       onChange={(e) => setEntityType(e.target.value)}
//                     >
//                       <option value="">Select Type</option>
//                       <option value="PRM">Perimeter (PRM)</option>
//                       <option value="BLC">Block (BLC)</option>
//                       <option value="WELL">Well (WELL)</option>
//                       <option value="2D">Seismic 2D</option>
//                       <option value="3D">Seismic 3D</option>
//                     </select>
//                   </div>

//                   {entityType === 'PRM' && (
//                     <>
//                       <div className="modal-field">
//                         <label>Name</label>
//                         <input
//                           type="text"
//                           name="name"
//                           value={formData.name || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., REGGANE II"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Status</label>
//                         <input
//                           type="text"
//                           name="status"
//                           value={formData.status || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., Active"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Observation (Notes)</label>
//                         <textarea
//                           name="notes"
//                           value={formData.notes || ''}
//                           onChange={handleFormChange}
//                           placeholder="Enter notes"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Department ID</label>
//                         <input
//                           type="text"
//                           name="dept"
//                           value={formData.dept || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., 1"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Linked Perimeters (comma-separated IDs)</label>
//                         <input
//                           type="text"
//                           name="linked_prms"
//                           value={formData.linked_prms || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., 1,2,3"
//                         />
//                       </div>
//                     </>
//                   )}

//                   {entityType === 'BLC' && (
//                     <div className="modal-field">
//                       <label>ID</label>
//                       <input
//                         type="text"
//                         name="id"
//                         value={formData.id || ''}
//                         onChange={handleFormChange}
//                         placeholder="e.g., 337"
//                       />
//                     </div>
//                   )}

//                   {entityType === 'WELL' && (
//                     <>
//                       <div className="modal-field">
//                         <label>Sigle</label>
//                         <input
//                           type="text"
//                           name="sigle"
//                           value={formData.sigle || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., WELL-001"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Name</label>
//                         <input
//                           type="text"
//                           name="name"
//                           value={formData.name || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., Well 1"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Perimeter ID</label>
//                         <input
//                           type="text"
//                           name="prm"
//                           value={formData.prm || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., 1"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Type</label>
//                         <input
//                           type="text"
//                           name="type"
//                           value={formData.type || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., Exploration"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Objective</label>
//                         <input
//                           type="text"
//                           name="objective"
//                           value={formData.objective || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., Oil"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Start Date</label>
//                         <input
//                           type="date"
//                           name="start_date"
//                           value={formData.start_date || ''}
//                           onChange={handleFormChange}
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>End Date</label>
//                         <input
//                           type="date"
//                           name="end_date"
//                           value={formData.end_date || ''}
//                           onChange={handleFormChange}
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Result</label>
//                         <input
//                           type="text"
//                           name="result"
//                           value={formData.result || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., Dry"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>State</label>
//                         <input
//                           type="text"
//                           name="state"
//                           value={formData.state || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., Abandoned"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Cost</label>
//                         <input
//                           type="number"
//                           name="cost"
//                           value={formData.cost || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., 1000000"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Company</label>
//                         <input
//                           type="text"
//                           name="company"
//                           value={formData.company || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., Sonatrach"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Offshore</label>
//                         <select
//                           name="offshore"
//                           value={formData.offshore || ''}
//                           onChange={handleFormChange}
//                         >
//                           <option value="">Select</option>
//                           <option value="true">Yes</option>
//                           <option value="false">No</option>
//                         </select>
//                       </div>
//                     </>
//                   )}

//                   {(entityType === '2D' || entityType === '3D') && (
//                     <>
//                       <div className="modal-field">
//                         <label>Name (Nom Etude)</label>
//                         <input
//                           type="text"
//                           name="name"
//                           value={formData.name || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., Seismic Study 1"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Perimeter ID</label>
//                         <input
//                           type="text"
//                           name="prm"
//                           value={formData.prm || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., 1"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Activity (Designations)</label>
//                         <input
//                           type="text"
//                           name="activity"
//                           value={formData.activity || 'Acq'}
//                           onChange={handleFormChange}
//                           placeholder="e.g., Acq"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Start Date</label>
//                         <input
//                           type="date"
//                           name="start_date"
//                           value={formData.start_date || ''}
//                           onChange={handleFormChange}
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>End Date</label>
//                         <input
//                           type="date"
//                           name="end_date"
//                           value={formData.end_date || ''}
//                           onChange={handleFormChange}
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Company (Compagnie Service)</label>
//                         <input
//                           type="text"
//                           name="company"
//                           value={formData.company || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., Sonatrach"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Kilometrage</label>
//                         <input
//                           type="number"
//                           name="kilometrage"
//                           value={formData.kilometrage || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., 100"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Cost (Couts)</label>
//                         <input
//                           type="number"
//                           name="cost"
//                           value={formData.cost || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., 500000"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label>Data Quality</label>
//                         <input
//                           type="text"
//                           name="data_quality"
//                           value={formData.data_quality || ''}
//                           onChange={handleFormChange}
//                           placeholder="e.g., High"
//                         />
//                       </div>
//                     </>
//                   )}

//                   <button onClick={handleSavePolygon} className="modal-button">
//                     Save
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Home;




// ------------test for save polygon--------------------

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, Popup, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet.pm/dist/leaflet.pm.css';
import 'leaflet.pm';
import './Home.css';
import { username } from '../components/App';
import 'leaflet/dist/leaflet.css';
// import 'leaflet.pm/dist/leaflet.pm.css';
// import 'leaflet.pm/dist/leaflet.pm';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@geoman-io/leaflet-geoman-free';
import 'leaflet.pm';
// import L from 'leaflet';
axios.defaults.withCredentials = true;

// Fix for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Algeria boundary coordinates (simplified polygon)
const algeriaBoundary = [
  [37.5, -1.5], [37.5, 8.5], [34.5, 8.5], [31.5, 8.5], [31.5, 2.5],
  [27.5, 2.5], [27.5, -1.5], [29.5, -5.5], [33.5, -8.5], [37.5, -1.5],
];

function MapControls({ onCenterMap }) {
  const map = useMap();

  if (!map) {
    console.warn('MapControls: Map instance is not available');
    return null;
  }

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="map-controls">
      <button
        onClick={handleZoomIn}
        className="map-control-button"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        onClick={handleZoomOut}
        className="map-control-button"
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16" />
        </svg>
      </button>
      <button
        onClick={onCenterMap}
        className="map-control-button"
        title="Center Map"
        aria-label="Center Map"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12h-6m-3-9v6m-9 3h6m3 9v-6" />
        </svg>
      </button>
    </div>
  );
}

function DrawPolygon({ onCreated, entityType }) {
  const map = useMap();
  console.log('DrawPolygon: Map instance:', map);

  useEffect(() => {
    if (!map) {
      console.warn('DrawPolygon: Map instance is not available');
      return;
    }

    // Remove any existing controls first
    map.pm.disableDraw();
    map.pm.removeControls();

    // Add drawing controls based on entityType
    map.pm.addControls({
      position: 'topright',
      drawPolygon: entityType !== 'WELL',
      drawMarker: entityType === 'WELL',
      drawPolyline: false,
      drawRectangle: false,
      drawCircle: false,
      drawCircleMarker: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
    });

    // Handle polygon/marker creation
    const handleCreate = (e) => {
      try {
        if (e.shape === 'Polygon') {
          const layer = e.layer;
          let latlngs = layer.getLatLngs()[0].map((latlng) => [latlng.lat, latlng.lng]);
          if (
            latlngs.length >= 3 &&
            (latlngs[0][0] !== latlngs[latlngs.length - 1][0] || 
             latlngs[0][1] !== latlngs[latlngs.length - 1][1])
          ) {
            latlngs.push(latlngs[0]);
          }
          onCreated(latlngs);
          console.log('Polygon drawn:', latlngs);
          map.removeLayer(layer);
        } else if (e.shape === 'Marker') {
          const latlng = e.marker.getLatLng();
          const point = [latlng.lat, latlng.lng];
          onCreated(point);
          console.log('Marker drawn:', point);
          map.removeLayer(e.marker);
        }
      } catch (error) {
        console.error('Error handling shape creation:', error);
      }
    };

    map.on('pm:create', handleCreate);

    // Cleanup on unmount
    return () => {
      map.off('pm:create', handleCreate);
      map.pm.disableDraw();
      map.pm.removeControls();
    };
  }, [map, onCreated, entityType]);

  return null;
}

function Home({ username, isManager }) {
  const [layers, setLayers] = useState({
    perimetres: true,
    blocs: false,
    puits: false,
    sismique2D: false,
    sismique3D: false,
  });
  const [showLegend, setShowLegend] = useState(false);
  const [showCoordinateInput, setShowCoordinateInput] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [entityType, setEntityType] = useState('');
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [concessions, setConcessions] = useState([]);
  const [blocs, setBlocs] = useState([]);
  const [wells, setWells] = useState([]);
  const [seismic2D, setSeismic2D] = useState([]);
  const [seismic3D, setSeismic3D] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const mapRef = useRef();
  const [subordinates, setSubordinates] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  useEffect(() => {
    const getCsrfToken = () => {
      const name = 'csrftoken=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
      }
      return '';
    };

    axios.defaults.headers.common['X-CSRFToken'] = getCsrfToken();
    console.log('CSRF Token set:', axios.defaults.headers.common['X-CSRFToken']);

    const checkAuthStatus = async () => {
      try {
        const authResponse = await axios.get('http://127.0.0.1:8000/api/auth-status/', {
          withCredentials: true,
        });
        console.log('Auth status:', authResponse.data);
        setIsAuthenticated(authResponse.data.is_authenticated);
        if (!authResponse.data.is_authenticated) {
          alert('You are not authenticated. Please log in.');
          window.location.href = 'http://127.0.0.1:8000/login/';
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        alert('Authentication check failed. Please log in.');
        window.location.href = 'http://127.0.0.1:8000/login/';
      }
    };

    const fetchData = async () => {
      if (!isAuthenticated) return;
      try {
        const [concessionsRes, blocsRes, wellsRes, seismic2dRes, seismic3dRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/map/concessions/', { withCredentials: true }),
          axios.get('http://127.0.0.1:8000/api/map/blocs/', { withCredentials: true }),
          axios.get('http://127.0.0.1:8000/api/map/wells/', { withCredentials: true }),
          axios.get('http://127.0.0.1:8000/api/map/seismic/', { params: { type: '2D' }, withCredentials: true }),
          axios.get('http://127.0.0.1:8000/api/map/seismic/', { params: { type: '3D' }, withCredentials: true }),
        ]);

        setConcessions(concessionsRes.data);
        setBlocs(blocsRes.data);
        setWells(wellsRes.data);
        setSeismic2D(seismic2dRes.data);
        setSeismic3D(seismic3dRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 403 || error.response?.status === 401) {
          alert('Authentication required. Please log in.');
          window.location.href = 'http://127.0.0.1:8000/login/';
        }
      }
    };

    const fetchSubordinates = async () => {
      if (isManager && isAuthenticated) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/subordinates/', {
            withCredentials: true,
          });
          setSubordinates(response.data);
        } catch (error) {
          console.error('Error fetching subordinates:', error);
        }
      }
    };

    checkAuthStatus().then(() => {
      fetchData();
      fetchSubordinates();
    });
  }, [isManager, isAuthenticated]);

  const toggleLayer = (layer) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleCenterMap = () => {
    const map = mapRef.current;
    if (map) {
      map.setView([33.5, 2.5], 5);
    } else {
      console.warn('handleCenterMap: Map instance is not available');
    }
  };

  const handleDrawCreated = (latlngs) => {
    if (!latlngs) {
      console.error('Invalid latlngs:', latlngs);
      return;
    }

    if (entityType === 'WELL') {
      if (!Array.isArray(latlngs) || latlngs.length !== 2 || typeof latlngs[0] !== 'number' || typeof latlngs[1] !== 'number') {
        console.error('Invalid point for WELL:', latlngs);
        return;
      }
    } else {
      if (!Array.isArray(latlngs) || latlngs.length === 0 || !latlngs.every(coord => Array.isArray(coord) && coord.length === 2)) {
        console.error('Invalid coordinate format in latlngs:', latlngs);
        return;
      }
    }
    console.log('Setting currentShape:', latlngs);

    setCurrentShape(latlngs);
    setShowDetailsModal(true);
  };

  const addShapeFromCoordinates = () => {
    if (!lat || !lng) {
      console.error('Latitude or Longitude is empty');
      return;
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      console.error('Invalid Latitude or Longitude:', lat, lng);
      return;
    }

    const newCoord = [parsedLat, parsedLng];

    if (entityType === 'WELL') {
      setCurrentShape(newCoord);
      setCoordinates([]);
      setShowCoordinateInput(false);
      setShowDetailsModal(true);
      console.log('Point added for WELL:', newCoord);
    } else {
      const newCoords = [...coordinates, newCoord];
      if (newCoords.length === 4) {
        setCurrentShape(newCoords);
        setCoordinates([]);
        setShowCoordinateInput(false);
        setShowDetailsModal(true);
        console.log('Polygon added via coordinates:', newCoords);
      } else {
        setCoordinates(newCoords);
      }
    }

    setLat('');
    setLng('');
  };

  const handleSavePolygon = async () => {
    if (!entityType) {
      console.error('Entity type is not selected');
      alert('Please select an entity type');
      return;
    }

    if (!currentShape) {
      console.error('No shape to save');
      alert('No shape to save');
      return;
    }

    if (entityType === 'WELL') {
      if (!Array.isArray(currentShape) || currentShape.length !== 2 || typeof currentShape[0] !== 'number' || typeof currentShape[1] !== 'number') {
        console.error('Invalid point for WELL:', currentShape);
        alert('Invalid coordinates for Well. Please provide a single [lat, lng] point.');
        return;
      }
    } else {
      if (!Array.isArray(currentShape) || currentShape.length === 0 || !currentShape.every(coord => Array.isArray(coord) && coord.length === 2)) {
        console.error('Invalid shape for entityType:', entityType, currentShape);
        alert('Invalid shape. Please draw a valid polygon.');
        return;
      }
    }

    const payload = {
      entity_type: entityType,
      data: {
        ...formData,
        ...(entityType === 'WELL' ? { position: currentShape } : { positions: currentShape }),
      },
    };

    // // Ensure id is an integer if present
    // if (payload.data.id && typeof payload.data.id === 'string') {
    //   payload.data.id = parseInt(payload.data.id, 10) || null;
    // }

    try {
      console.log('Payload being sent:', payload);
      const response = await axios.post('http://127.0.0.1:8000/api/save-polygon/', payload, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': axios.defaults.headers.common['X-CSRFToken'] || '',
        },
      });

      console.log('Entity saved:', response.data);
      const { positions } = response.data;
      if (positions && Array.isArray(positions)) {
        setDrawnShapes((prev) => [...prev, positions]);
      } else {
        console.warn('No valid positions in response, using currentShape:', currentShape);
        setDrawnShapes((prev) => [...prev, currentShape]);
      }

      if (entityType === 'PRM') {
        const concessionsRes = await axios.get('http://127.0.0.1:8000/api/map/concessions/', { withCredentials: true });
        console.log('Updated concessions:', concessionsRes.data);
        setConcessions(concessionsRes.data);
      } else if (entityType === 'BLC') {
        const blocsRes = await axios.get('http://127.0.0.1:8000/api/map/blocs/', { withCredentials: true });
        console.log('Updated blocs:', blocsRes.data);
        setBlocs(blocsRes.data);
      } else if (entityType === 'WELL') {
        const wellsRes = await axios.get('http://127.0.0.1:8000/api/map/wells/', { withCredentials: true });
        console.log('Updated wells:', wellsRes.data);
        setWells(wellsRes.data);
      } else if (entityType === '2D') {
        const seismic2dRes = await axios.get('http://127.0.0.1:8000/api/map/seismic/', { params: { type: '2D' }, withCredentials: true });
        console.log('Updated seismic2D:', seismic2dRes.data);
        setSeismic2D(seismic2dRes.data);
      } else if (entityType === '3D') {
        const seismic3dRes = await axios.get('http://127.0.0.1:8000/api/map/seismic/', { params: { type: '3D' }, withCredentials: true });
        console.log('Updated seismic3D:', seismic3dRes.data);
        setSeismic3D(seismic3dRes.data);
      }

      setShowDetailsModal(false);
      setCurrentShape(null);
      setFormData({});
      setEntityType('');
    } catch (error) {
      console.error('Error saving entity:', error.response?.data || error.message);
      alert('Failed to save entity: ' + (error.response?.data?.detail || 'Authentication or server error. Please log in again.'));
      if (error.response?.status === 403 || error.response?.status === 401) {
        window.location.href = 'http://127.0.0.1:8000/login/';
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/search/', {
        params: { query: searchQuery },
        withCredentials: true,
      });
      setSearchResults(response.data);
      console.log('Search results:', response.data);

      if (response.data.length > 0) {
        const result = response.data[0];
        const map = mapRef.current;
        if (map && result.position) {
          map.setView(result.position, 10);
        } else if (map && result.positions) {
          map.fitBounds(result.positions);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    fetch('http://127.0.0.1:8000/logout/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(() => {
        window.location.href = 'http://127.0.0.1:8000/login/';
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <div>
      <header>
        <div className="container">
          <h1>Plateforme Sonatrach</h1>
          <p>
            Bienvenue, {username} | <button onClick={handleLogout}>Déconnexion</button>
            {isManager && (
              <>
                {' | '}
                <span>Manager</span>
                {subordinates.length > 0 ? (
                  <span> (Subordinates: {subordinates.map(sub => sub.username).join(', ')})</span>
                ) : (
                  <span> (No subordinates)</span>
                )}
              </>
            )}
          </p>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="toolbar">
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher (e.g., PRM:REGGANE II, BLC:337, ...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <button onClick={handleSearch} className="search-button">
                Rechercher
              </button>
            </div>

            <div className="layer-toggles">
              {Object.keys(layers).map((layer) => (
                <label key={layer} className="layer-toggle">
                  <input
                    type="checkbox"
                    checked={layers[layer]}
                    onChange={() => toggleLayer(layer)}
                  />
                  <span>{layer}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowLegend(!showLegend)}
              className="legend-button"
            >
              {showLegend ? 'Masquer la légende' : 'Afficher la légende'}
            </button>
          </div>

          <div className="map-container">
            <MapContainer
              center={[33.5, 2.5]}
              zoom={5}
              style={{ height: '600px', width: '100%' }}
              whenCreated={(map) => {
                mapRef.current = map;
                console.log('MapContainer: Map instance created', map);
              }}
              className="map"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {layers.perimetres &&
                concessions
                  .filter(concession =>
                    concession.positions &&
                    Array.isArray(concession.positions) &&
                    concession.positions.length > 0 &&
                    concession.positions.every(coord => Array.isArray(coord) && coord.length === 2)
                  )
                  .map((concession) => (
                    <Polygon
                      key={concession.name}
                      positions={concession.positions}
                      pathOptions={{ color: '#FF9800' }}
                    >
                      <Popup>
                        <div>{concession.name}</div>
                      </Popup>
                    </Polygon>
                  ))}

              {layers.blocs &&
                blocs
                  .filter(bloc =>
                    bloc.positions &&
                    Array.isArray(bloc.positions) &&
                    bloc.positions.length > 0 &&
                    bloc.positions.every(coord => Array.isArray(coord) && coord.length === 2)
                  )
                  .map((bloc) => (
                    <Polygon
                      key={bloc.id}
                      positions={bloc.positions}
                      pathOptions={{ color: '#2196F3' }}
                    >
                      <Popup>
                        <div>{bloc.id}</div>
                      </Popup>
                    </Polygon>
                  ))}

              {layers.puits &&
                wells
                  .filter(well =>
                    well.position &&
                    Array.isArray(well.position) &&
                    well.position.length === 2
                  )
                  .map((well) => (
                    <Marker key={well.sigle} position={well.position}>
                      <Popup>
                        <div>{well.sigle}</div>
                      </Popup>
                    </Marker>
                  ))}

              {layers.sismique2D &&
                seismic2D
                  .filter(seismic =>
                    seismic.positions &&
                    Array.isArray(seismic.positions) &&
                    seismic.positions.length > 0 &&
                    seismic.positions.every(coord => Array.isArray(coord) && coord.length === 2)
                  )
                  .map((seismic) => (
                    <Polyline
                      key={seismic.nom_etude}
                      positions={seismic.positions}
                      pathOptions={{ color: '#FF0000' }}
                    >
                      <Popup>
                        <div>{seismic.nom_etude}</div>
                      </Popup>
                    </Polyline>
                  ))}

              {layers.sismique3D &&
                seismic3D
                  .filter(seismic =>
                    seismic.positions &&
                    Array.isArray(seismic.positions) &&
                    seismic.positions.length > 0 &&
                    seismic.positions.every(coord => Array.isArray(coord) && coord.length === 2)
                  )
                  .map((seismic) => (
                    <Polygon
                      key={seismic.nom_etude}
                      positions={seismic.positions}
                      pathOptions={{ color: '#00FF00' }}
                    >
                      <Popup>
                        <div>{seismic.nom_etude}</div>
                      </Popup>
                    </Polygon>
                  ))}

              {drawnShapes.map((shape, index) => (
                shape && Array.isArray(shape) && shape.length > 0 && shape.every(coord => Array.isArray(coord) && coord.length === 2) ? (
                  <Polygon key={index} positions={shape} pathOptions={{ color: 'cyan' }} />
                ) : null
              ))}

              <DrawPolygon onCreated={handleDrawCreated} entityType={entityType} />
              <MapControls onCenterMap={handleCenterMap} />
            </MapContainer>

            <button
              onClick={() => setShowCoordinateInput(true)}
              className="draw-polygon-button"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m3-3v6m6 6H6a3 3 0 01-3-3V6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3z" />
              </svg>
              Dessiner un polygone
            </button>

            {showLegend && (
              <div className="legend-panel">
                <h3>Légende de recherche</h3>
                <ul>
                  <li><span>PRM:</span> {`<nom prm>`} - Rechercher un périmètre (e.g., PRM:REGGANE II)</li>
                  <li><span>BLC:</span> {`<numéro>`} - Rechercher un bloc (e.g., BLC:337)</li>
                  <li><span>WELL:</span> {`<nom du puits>`} - Rechercher un puits</li>
                  <li><span>2D:</span> {`<nom de l'étude>`} - Rechercher une activité sismique 2D</li>
                  <li><span>3D:</span> {`<nom de l'étude>`} - Rechercher une activité sismique 3D</li>
                  <li><span>D:</span> {`<nom du département>`} - Rechercher un département</li>
                </ul>
              </div>
            )}

            {showCoordinateInput && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h2>Entrer des coordonnées</h2>
                    <button
                      onClick={() => setShowCoordinateInput(false)}
                      className="modal-close-button"
                      aria-label="Close Modal"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="modal-field">
                    <label>Entity Type</label>
                    <select
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="PRM">Perimeter (PRM)</option>
                      <option value="BLC">Block (BLC)</option>
                      <option value="WELL">Well (WELL)</option>
                      <option value="2D">Seismic 2D</option>
                      <option value="3D">Seismic 3D</option>
                    </select>
                  </div>
                  {entityType && (
                    <>
                      <div className="modal-field">
                        <label>Latitude</label>
                        <input
                          type="number"
                          step="any"
                          value={lat}
                          onChange={(e) => setLat(e.target.value)}
                          placeholder="e.g., 34.5"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Longitude</label>
                        <input
                          type="number"
                          step="any"
                          value={lng}
                          onChange={(e) => setLng(e.target.value)}
                          placeholder="e.g., 2.0"
                        />
                      </div>
                      <button
                        onClick={addShapeFromCoordinates}
                        className="modal-button"
                      >
                        Ajouter le point {entityType === 'WELL' ? '' : `(${coordinates.length + 1}/4)`}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {showDetailsModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h2>Enter Entity Details</h2>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setCurrentShape(null);
                        setFormData({});
                        setEntityType('');
                      }}
                      className="modal-close-button"
                      aria-label="Close Modal"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="modal-field">
                    <label>Entity Type</label>
                    <select
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="PRM">Perimeter (PRM)</option>
                      <option value="BLC">Block (BLC)</option>
                      <option value="WELL">Well (WELL)</option>
                      <option value="2D">Seismic 2D</option>
                      <option value="3D">Seismic 3D</option>
                    </select>
                  </div>

                  {entityType === 'PRM' && (
                    <>
                      <div className="modal-field">
                        <label>Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., REGGANE II"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Status</label>
                        <input
                          type="text"
                          name="status"
                          value={formData.status || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., Active"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Observation (Notes)</label>
                        <textarea
                          name="notes"
                          value={formData.notes || ''}
                          onChange={handleFormChange}
                          placeholder="Enter notes"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Department ID</label>
                        <input
                          type="text"
                          name="dept"
                          value={formData.dept || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., 1"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Linked Perimeters (comma-separated IDs)</label>
                        <input
                          type="text"
                          name="linked_prms"
                          value={formData.linked_prms || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., 1,2,3"
                        />
                      </div>
                    </>
                  )}

                  {entityType === 'BLC' && (
                    <div className="modal-field">
                      <label>ID</label>
                      <input
                        type="text"
                        name="id"
                        value={formData.id || ''}
                        onChange={handleFormChange}
                        placeholder="e.g., 337"
                      />
                    </div>
                  )}

                  {entityType === 'WELL' && (
                    <>
                      <div className="modal-field">
                        <label>Sigle</label>
                        <input
                          type="text"
                          name="sigle"
                          value={formData.sigle || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., WELL-001"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., Well 1"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Perimeter ID</label>
                        <input
                          type="text"
                          name="prm"
                          value={formData.prm || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., 1"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Type</label>
                        <input
                          type="text"
                          name="type"
                          value={formData.type || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., Exploration"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Objective</label>
                        <input
                          type="text"
                          name="objective"
                          value={formData.objective || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., Oil"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Start Date</label>
                        <input
                          type="date"
                          name="start_date"
                          value={formData.start_date || ''}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="modal-field">
                        <label>End Date</label>
                        <input
                          type="date"
                          name="end_date"
                          value={formData.end_date || ''}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="modal-field">
                        <label>Result</label>
                        <input
                          type="text"
                          name="result"
                          value={formData.result || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., Dry"
                        />
                      </div>
                      <div className="modal-field">
                        <label>State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., Abandoned"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Cost</label>
                        <input
                          type="number"
                          name="cost"
                          value={formData.cost || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., 1000000"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., Sonatrach"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Offshore</label>
                        <select
                          name="offshore"
                          value={formData.offshore || ''}
                          onChange={handleFormChange}
                        >
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </>
                  )}

                  {(entityType === '2D' || entityType === '3D') && (
                    <>
                      <div className="modal-field">
                        <label>Name (Nom Etude)</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., Seismic Study 1"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Perimeter ID</label>
                        <input
                          type="text"
                          name="prm"
                          value={formData.prm || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., 1"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Activity (Designations)</label>
                        <input
                          type="text"
                          name="activity"
                          value={formData.activity || 'Acq'}
                          onChange={handleFormChange}
                          placeholder="e.g., Acq"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Start Date</label>
                        <input
                          type="date"
                          name="start_date"
                          value={formData.start_date || ''}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="modal-field">
                        <label>End Date</label>
                        <input
                          type="date"
                          name="end_date"
                          value={formData.end_date || ''}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="modal-field">
                        <label>Company (Compagnie Service)</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., Sonatrach"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Kilometrage</label>
                        <input
                          type="number"
                          name="kilometrage"
                          value={formData.kilometrage || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., 100"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Cost (Couts)</label>
                        <input
                          type="number"
                          name="cost"
                          value={formData.cost || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., 500000"
                        />
                      </div>
                      <div className="modal-field">
                        <label>Data Quality</label>
                        <input
                          type="text"
                          name="data_quality"
                          value={formData.data_quality || ''}
                          onChange={handleFormChange}
                          placeholder="e.g., High"
                        />
                      </div>
                    </>
                  )}

                  <button onClick={handleSavePolygon} className="modal-button">
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;