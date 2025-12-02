import "@/styles/dashboard/hqs_panel.css";
import React, { useState, useEffect } from "react";
import CityForm from "./CitiesForm";

export default function CitiesPanel() {
  const [ciudades, setCiudades] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [filtroRegion, setFiltroRegion] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [cityEdit, setCityEdit] = useState(null);

  useEffect(() => {
    cargarRegiones();
    cargarCiudades();
  }, []);

  const cargarRegiones = async () => {
    try {
      const res = await fetch("/api/data/regions");
      const data = await res.json();
      setRegiones(data);
    } catch (err) {
      console.error("Error cargando regiones", err);
    }
  };

  const cargarCiudades = async () => {
    try {
      const res = await fetch("/api/data/cities");
      const data = await res.json();
      setCiudades(data);
    } catch (err) {
      console.error("Error cargando ciudades", err);
    }
  };

  // ------------------------
  // Manejo de formulario
  // ------------------------

  const abrirNueva = () => {
    setCityEdit(null);
    setShowForm(true);
  };

  const abrirEditar = (ciudad) => {
    setCityEdit(ciudad);
    setShowForm(true);
  };

  const guardarCiudad = async (data) => {
    if (cityEdit) {
      // actualizar
      await fetch(`/api/data/cities?id=${cityEdit.ID_CIUDAD}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      // crear
      await fetch("/api/data/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    await cargarCiudades();
    setShowForm(false);
  };

  const eliminarCiudad = async () => {
    if (!cityEdit) return;

    if (!confirm("¿Seguro que deseas eliminar esta ciudad?")) return;

    await fetch(`/api/data/cities?id=${cityEdit.ID_CIUDAD}`, {
      method: "DELETE",
    });

    await cargarCiudades();
    setShowForm(false);
  };

  // ------------------------
  // Filtrado
  // ------------------------

  const ciudadesFiltradas = filtroRegion
    ? ciudades.filter((c) => c.ID_REGION == filtroRegion)
    : ciudades;

  return (
    <div className="sede-wrapper">

      {/* Filtro */}
      <div className="sede-header">
        <label>Filtrar por región:</label>
        <select
          value={filtroRegion}
          onChange={(e) => setFiltroRegion(e.target.value)}
        >
          <option value="">Todas</option>
          {regiones.map((r) => (
            <option key={r.ID_REGION} value={r.ID_REGION}>
              {r.NOMBRE}
            </option>
          ))}
        </select>
      </div>

      {/* Botón Nueva Ciudad */}
      <button style={{ marginLeft: "auto", width: "30%" }} className="btn-nueva" onClick={abrirNueva}>
        + Nueva Ciudad
      </button>

      {/* Grid */}
      <div className="sede-grid">
        {ciudadesFiltradas.map((c) => (
          <div
            key={c.ID_CIUDAD}
            className="sede-item"
            onClick={() => abrirEditar(c)}
          >
            <h3>{c.NOMBRE}</h3>
            <p>Región: {c.REGION}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <CityForm
          ciudad={cityEdit}
          regiones={regiones}
          onSave={guardarCiudad}
          onDelete={eliminarCiudad}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
