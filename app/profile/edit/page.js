"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import "@/styles/nuevo_arriendo.css"

export default function EditProfile() {
    const { user, setUser, loading } = useContext(AuthContext);
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        rut: ""
    });

    useEffect(() => { 
      if (!loading && user) {
        setForm({
            nombre: user.NOMBRE || "",
            email: user.CORREO || "",
            rut: user.RUT || ""
        });
      }
    },[loading]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    async function handleSubmit(e) {
        e.preventDefault();
    }


    

   if(user) return (
    <div style={{ padding: "20px" }}>
      <h1>Editar Perfil</h1>

      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} />

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />

        <label>RUT</label>
        <input name="rut" value={form.rut} onChange={handleChange} />

        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}