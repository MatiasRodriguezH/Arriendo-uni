"use client";

import { MapContainer, TileLayer, useMapEvents, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function SetViewOnLoad({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) map.setView(coords, 16);
  }, [coords]);

  return null;
}

export default function MapPicker({ initialPosition, onSelectLocation }) {
  const [position, setPosition] = useState(initialPosition || null);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  function ClickHandler() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const res = await fetch(url);
        const data = await res.json();
        const addr = data.address || {};

        onSelectLocation({
          lat,
          lng,
          calle: addr.road || "",
          numero: addr.house_number || "",
          ciudad: addr.city || addr.town || addr.village || "",
          region: addr.state || ""
        });
      },
    });
    return null;
  }

  return (
    <div style={{ height: "300px", marginTop: "15px" }}>
      <MapContainer
        center={initialPosition || [-33.45, -70.66]} // Santiago por defecto
        zoom={initialPosition ? 16 : 13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickHandler />

        <SetViewOnLoad coords={initialPosition} />

        {position && (
          <Marker position={position} icon={markerIcon}>
            <Popup>
              Lat: {position[0].toFixed(5)} <br />
              Lng: {position[1].toFixed(5)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
