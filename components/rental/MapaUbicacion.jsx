"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import L from "leaflet";

// Fix marker icons in Next.js
const markerIcon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

function SelectorUbicacion({ onSelect }) {
  const [pos, setPos] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPos([lat, lng]);
      onSelect({ lat, lng });
    }
  });

  return pos ? <Marker position={pos} icon={markerIcon}/> : null;
}

export default function MapaUbicacion({ onChange }) {
  return (
    <div style={{ height: "300px", width: "100%", marginTop: "10px" }}>
      <MapContainer
        center={[-33.45, -70.66]}  
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SelectorUbicacion onSelect={onChange} />
      </MapContainer>
    </div>
  );
}
