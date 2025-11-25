import "@/styles/dashboard/hqs_panel.css"
import React, { useState, useEffect } from "react";
import HqsForm from "./HqsForm";

export default function SedesPanel() {
  const [sedes, setSedes] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [filtroInstitucion, setFiltroInstitucion] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [sedeEdit, setSedeEdit] = useState(null);

  useEffect(() => {
    cargarInstituciones();
    cargarSedes();
  }, []);

  const cargarInstituciones = async () => {
    try {
      const res = await fetch("/api/data/institutions");
      const data = await res.json();
      setInstituciones(data);
    } catch (err) {
      console.error("Error cargando instituciones", err);
    }
  };

  const cargarSedes = async () => {
    try {
      const res = await fetch("/api/data/hq-institutions?id=all");
      const data = await res.json();
      setSedes(data);
    } catch (err) {
      console.error("Error cargando sedes", err);
    }
  };

  // ------------------------
  // Manejo de formulario
  // ------------------------

  const abrirNueva = () => {
    setSedeEdit(null);
    setShowForm(true);
  };

  const abrirEditar = (sede) => {
    setSedeEdit(sede);
    setShowForm(true);
  };

  const guardarSede = async (data) => {
    if (sedeEdit) {
      // actualizar
      await fetch(`/api/data/hq-institutions?id=${sedeEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      // crear
      await fetch("/api/data/hq-institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    await cargarSedes();
    setShowForm(false);
  };

  const eliminarSede = async () => {
    if (!sedeEdit) return;

    if (!confirm("¿Seguro que deseas eliminar esta sede?")) return;

    await fetch(`/api/data/hq_institutions?id=${sedeEdit.id}`, {
      method: "DELETE",
    });

    await cargarSedes();
    setShowForm(false);
  };

  // ------------------------
  // Filtrado
  // ------------------------

  const sedesFiltradas = filtroInstitucion
    ? sedes.filter((s) => s.ID_INSTITUCION == filtroInstitucion)
    : sedes;

  return (
    <div className="sede-wrapper">
      <h2>Gestión de Sedes</h2>

      {/* Filtro */}
      <div className="sede-header">
        <label>Filtrar por institución:</label>
        <select
          value={filtroInstitucion}
          onChange={(e) => setFiltroInstitucion(e.target.value)}
        >
          <option value="">Todas</option>
          {instituciones.map((i) => (
            <option key={i.ID_INSTITUCION} value={i.ID_INSTITUCION}>
              {i.NOMBRE}
            </option>
          ))}
        </select>
      </div>

      {/* Botón Nueva Sede */}
      <button className="btn-nueva" onClick={abrirNueva}>
        + Nueva Sede
      </button>

      {/* Grid de Sedes */}
      <div className="sede-grid">
        {sedesFiltradas.map((sede) => (
          <div
            key={sede.ID_SEDE}
            className="sede-item"
            onClick={() => abrirEditar(sede)}
          >
            <h3>{sede.NOMBRE}</h3>
            <p>{sede.NOMBRE_INSTITUCION}</p>
            <p>{sede.CIUDAD}, {sede.REGION}</p>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <HqsForm
          sede={sedeEdit}
          instituciones={instituciones}
          onSave={guardarSede}
          onDelete={eliminarSede}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
