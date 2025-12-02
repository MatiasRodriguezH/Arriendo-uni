import React, { useState, useEffect } from "react";

export default function CityForm({ ciudad, regiones, onSave, onDelete, onClose }) {
  const [nombre, setNombre] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    if (ciudad) {
      setNombre(ciudad.NOMBRE);
      setRegion(ciudad.ID_REGION);
    }
  }, [ciudad]);

  const handleSubmit = () => {
    if (!nombre || !region) {
      alert("Debe completar todos los campos.");
      return;
    }

    const data = { nombre, region };
    onSave(data);
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>{ciudad ? "Editar Ciudad" : "Nueva Ciudad"}</h2>

        <label>Nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label>Región</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="" disabled>Seleccione región</option>
          {regiones.map((r) => (
            <option key={r.ID_REGION} value={r.ID_REGION}>
              {r.NOMBRE}
            </option>
          ))}
        </select>

        <div className="btn-group">
          <button className="btn-primary" onClick={handleSubmit}>Guardar</button>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          {ciudad && (
            <button className="btn-danger" onClick={onDelete}>Eliminar</button>
          )}
        </div>
      </div>
    </div>
  );
}
