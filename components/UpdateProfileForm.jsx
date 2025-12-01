"use client";

import "@/styles/form.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRut } from 'react-rut-formatter';

export default function UpdateForm({ user }) {

  const [form, setForm] = useState({
    id: user.ID_USUARIO || "",
    nombre: user.NOMBRE || "",
    apellido1: user.APELLIDO1 || "",
    apellido2: user.APELLIDO2 || "",
    telefono: user.TELEFONO || "",
    institucion: user.INSTITUCION || "",
    sede: user.SEDE || "",
    ciudad: user.ID_CIUDAD || ""
  });
  const [instituciones, setInstituciones] = useState([]);
  const [sedes, setSedes] = useState([]);
  const[rutValue, setRutValue] = useState("");
  const {rut, isValid, updateRut} = useRut(rutValue);
  const [contrasenia, setContrasenia] = useState();
  const [confirmarContrasenia, setConfirmarContrasenia] = useState();
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() =>{
    async function fetchInstituciones(){
      const result = await fetch(`http://localhost:3000/api/data/institutions`);
      const data = await result.json();
      setInstituciones(data);
    }

    async function fetchSedes(id) {
      const result = await fetch(`http://localhost:3000/api/data/hq-institutions?id=all`);
      const data = await result.json();
      setSedes(data);
    }
    
    updateRut(user.RUT);
    fetchInstituciones();
    fetchSedes();
    console.log(instituciones);
  },[]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nombre || !form.apellido1){
      setError("Algunos campos no pueden quedar vacios");
      return null;
    }
    if (user.ROL_USUARIO == "arrendador" && !form.ciudad ){
      setError("Algunos campos no pueden quedar vacios");
      return null;
    }
    if (contrasenia != confirmarContrasenia){
      setError("contraseñas no coinciden");
      return null;
    }
    setForm(prev => ({
      ...prev,
      ...(contrasenia && { contrasenia }),
      rut: rut.raw
    }));

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert("Perfil actualizado");
    }

  return (
    <div className="content">
      <h2>Editar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <h3 style={{marginTop:'1rem'}}>Información</h3>
        <h4>Nombre</h4>
        <input style={{width:'100%'}} name="nombre" value={form.nombre} onChange={handleChange} />

        <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
          <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
            <h4>Primer apellido</h4>
            <input name="apellido1" value={form.apellido1} onChange={handleChange} />
          </div>
          <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
            <h4>Segundo apellido</h4>
            <input name="apellido2" value={form.apellido2} onChange={handleChange} />
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'row', gap:'2%', marginTop:'1rem'}}>
          <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
            <h4>RUT</h4>
            <input value={rut.formatted} onChange={(e) => updateRut(e.target.value)} />
          </div>
          <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
            <h4>Telefono</h4>
            <input name="telefono" value={form.telefono} onChange={handleChange} />
          </div>
        </div>

        {(user.ROL_USUARIO == "estudiante") && (
        <>
        <h4 style={{marginTop:'1rem'}}>Institucion</h4>
        <select style={{width:'100%'}} name="institucion" value={form.institucion} onChange={handleChange}>
          {instituciones.map((s, index) => (
            <option key={s.ID_INSTITUCION} value={s.ID_INSTITUCION}>
              {s.NOMBRE}
            </option>
          ))}
        </select>

        <h4>Sede</h4>
        <select style={{width:'100%'}} name="sede" value={form.sede} onChange={handleChange}>
          {sedes.filter(s => s.ID_INSTITUCION === form.institucion).map((s, index) => (
            <option key={s.ID_SEDE} value={s.ID_SEDE}>
              {s.NOMBRE} - {s.CIUDAD}
            </option>
          ))}
        </select>
        </>
        )}
        {(user.ROL_USUARIO == "arrendador") && (
          <input name="ciudad" value={form.ciudad} onChange={handleChange} />
        )}

        <h3 style={{marginTop:'1rem'}}>Seguridad</h3>
        
        <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
          <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
            <h4>Nueva contraseña</h4>
            <input value={contrasenia} onChange={(e) => setContrasenia(e.target.value)}/>
          </div>
          <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
            <h4>Confirmar nueva contraseña</h4>
            <input value={confirmarContrasenia} onChange={(e) => setConfirmarContrasenia(e.target.value)}/>
          </div>
        </div>

        < br />

        <div style={{display: 'flex', gap:'1rem'}}>
          <button type="submit" style={{ padding: "10px 20px", background: "#00638e", color: "white", border: "none", borderRadius: "0.5rem", cursor:'pointer' }}>
          Guardar cambios
          </button>
          <button type="button" style={{ padding: "10px 20px", background: "red", color: "white", border: "none", borderRadius: "0.5rem", cursor:'pointer' }} 
          onClick={() => router.push('/profile')}>
          Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
