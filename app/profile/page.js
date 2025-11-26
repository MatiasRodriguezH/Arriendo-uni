"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <p>Cargando datos...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mi Perfil</h1>

      <p><strong>Nombre:</strong> {user.NOMBRE}</p>
      <p><strong>Email:</strong> {user.EMAIL}</p>
      <p><strong>RUT:</strong> {user.RUT}</p>

      <br />
      <a href="/profile/edit">Editar Perfil</a>
    </div>
  );
}

