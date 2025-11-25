import { useState } from "react";
import "@/styles/dashboard/institutions_panel.css"

export default function FormInstitution({ setForm , reload}) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("universidad");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const body = { nombre: nombre, tipo_institucion: tipo };

    try {
      const res = await fetch("/api/data/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setNombre("");
        setTipo("universidad");
        setLoading(false);
        setForm(false);
        reload();
      } else {
        alert(data.error || "Error al crear institución");
      }
    } catch (err) {
      console.error(err);
      alert("Hubo un error en el servidor");
    }

    setLoading(false);
  }

  return (
    <form className="form-institucion" onSubmit={handleSubmit}>
      <h3>Crear Nueva Institución</h3>

      <label>Nombre</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <label>Tipo de Institución</label>
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="universidad">Universidad</option>
        <option value="instituto profesional">Instituto Profesional</option>
        <option value="centro de formacion tecnica">
          Centro de Formación Técnica
        </option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>
      <button onClick={() => setForm(false)} disabled={loading}>
        Cancelar
      </button>
    </form>
  );
}
