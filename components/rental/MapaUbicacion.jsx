"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import L from "leaflet";

// Fix marker icons
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- Componente que actualiza el mapa al buscar ---
function MoverMapa({ position }) {
  const map = useMap();
  if (position) map.setView(position, 16);
  return null;
}

// --- Componente para seleccionar ubicación con click ---
function ClickParaSeleccion({ setPosicion, onChange }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const nueva = [lat, lng];
      setPosicion(nueva);
      onChange({ lat, lng });
    }
  });
  return null; // No renderiza nada
}

// --- Componente principal ---
export default function MapaUbicacion({ direccion, onChange }) {
  const [posicion, setPosicion] = useState(null);

  async function buscarDireccion() {
    const texto = `${direccion.calle} ${direccion.numero}, ${direccion.ciudad}, ${direccion.region}, Chile`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.length === 0) {
      alert("Dirección no encontrada");
      return;
    }

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);

    setPosicion([lat, lon]);  // ✔ un solo marcador
    onChange({ lat, lon });
  }

  return (
    <div>
      <button onClick={buscarDireccion} style={{ padding:'0.5rem 1rem', margin:'1rem 0rem 1rem'}}>
        Buscar en direccion en el mapa
      </button>

      <div style={{ height: "300px", width: "100%" }}>
        <MapContainer
          center={posicion || [-33.45, -70.66]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <MoverMapa position={posicion} />

          <ClickParaSeleccion setPosicion={setPosicion} onChange={onChange} />

          {/* 👇 Solo un marcador */}
          {posicion && <Marker position={posicion} icon={markerIcon} />}
        </MapContainer>
      </div>
    </div>
  );
}
