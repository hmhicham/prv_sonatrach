import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom icon
const customIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapComponent() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      // Remove existing map if it exists
      if (mapRef.current.leafletMap) {
        mapRef.current.leafletMap.remove();
      }

      // Create new map instance
      const map = L.map(mapRef.current).setView([28.175, 2.6], 5);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add Algeria boundary
      const algeriaBounds = [
        [20.5, -12.5],
        [37.5, 12.5]
      ];
      L.rectangle(algeriaBounds, { 
        color: "#d89400", 
        weight: 2,
        fillOpacity: 0.1
      }).addTo(map);

      // Add major regions markers with custom icon
      const regions = [
        { name: "Hassi Messaoud", lat: 31.3, lng: 6.2 },
        { name: "In Salah", lat: 27.5, lng: 4.5 },
        { name: "Illizi", lat: 24.5, lng: 9.5 },
        { name: "Tamanrasset", lat: 22.2, lng: 5.5 },
        { name: "Adrar", lat: 27.5, lng: -0.5 }
      ];

      regions.forEach(region => {
        L.marker([region.lat, region.lng], { icon: customIcon })
          .bindPopup(region.name)
          .addTo(map);
      });

      // Add Algeria flag marker with custom icon
      L.marker([28.175, 2.6], { icon: customIcon })
        .bindPopup('Algérie')
        .addTo(map);

      mapRef.current.leafletMap = map;
    }
  }, []);

  return (
    <div 
      ref={mapRef}
      style={{
        height: '600px',
        width: '100%',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    />
  );
}

export default MapComponent;