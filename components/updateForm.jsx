"use client";

import { useState } from "react";

export default function UpdateForm({ user }) {

  const [form, setForm] = useState({
    nombre: user.NOMBRE || "",
    email: user.CORREO || "",
    rut: user.RUT || "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert("Perfil actualizado");
    }

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre:</label>
      <input name="nombre" value={form.nombre} onChange={handleChange} />

      <label>Email:</label>
      <input name="email" value={form.email} onChange={handleChange} />

      <label>RUT:</label>
      <input name="rut" value={form.rut} onChange={handleChange} />

      <button type="submit">Guardar cambios</button>
    </form>
  );
}
