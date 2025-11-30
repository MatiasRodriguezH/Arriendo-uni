"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import "@/styles/nuevo_arriendo.css";


export default function ProfileView() {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Cargando datos...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mi Perfil</h1>

      <p><strong>Nombre:</strong> {user.NOMBRE}</p>
      <p><strong>Email:</strong> {user.CORREO}</p>
      <p><strong>RUT:</strong> {user.RUT}</p>

      <br />
      <a href="/profile/edit">Editar Perfil</a>
    </div>
  );
}
