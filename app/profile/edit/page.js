"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function EditProfile() {
    const { user, setUser } = useAuth();

    const [form, setForm] = useState({
        NOMBRE: user.NOMBRE || "",
        EMAIL: user.EMAIL || "",
        RUT: user.RUT || ""
    });

      function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    async function handleSubmit(e) {
        e.preventDefault();
    }


    

    return (
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