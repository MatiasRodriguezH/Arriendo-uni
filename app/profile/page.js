"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <p>Cargando datos...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mi Perfil</h1>

      <p><strong>Nombre:</strong> {user.nombre}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>RUT:</strong> {user.rut}</p>

      <a href="/profile/edit">Editar Perfil</a>
    </div>
  );
}

