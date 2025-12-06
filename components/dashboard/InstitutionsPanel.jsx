import { useEffect, useState } from "react";
import "@/styles/dashboard/institutions_panel.css";
import FormInstitution from "./FormInstitution";

export default function InstitutionsPanel() {
  const [form,setForm] = useState(false);
  const [instituciones, setInstituciones] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
      try {
        const res = await fetch("/api/data/institutions");
        const data = await res.json();
        setInstituciones(data);
      } catch (e) {
        console.error("Error cargando instituciones:", e);
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!form){ return (
    <div className="instituciones-container">

      <div className="header">
        <h2>Instituciones</h2>
        <button className="btn-nueva" onClick={() => setForm(true)}>+ Nueva Institución</button>
      </div>

      {loading ? (
        <p className="loading">Cargando...</p>
      ) : (
        <div className="grid">
          {instituciones.map((inst) => (
            <div className="card" key={inst.ID_INSTITUCION}>
              <h3>{inst.NOMBRE}</h3>
              <p style={{color: '#787878ff'}} className="tipo">{inst.SIGLAS}</p>
              <p style={{color: '#00638e'}} className="tipo">{inst.TIPO_INSTITUCION}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );}
  else{
    return(<FormInstitution setForm={setForm} reload={fetchData}/>)
  }
}
