"use client";

import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect } from "react";
import Header from "@/components/Header";

export default function ProfilePage() {
  const { user, isLogin, loading } = useContext(AuthContext);

  useEffect(() => {
      if (!isLogin && !loading) {
        window.location.replace("/"); // o la ruta que quieras
      }
    }, [isLogin]);

  if (loading) return <p>Cargando datos...</p>;
  
  return (
    <>
    <Header/>
    <div style={{ padding: "20px" }}>
      <h1>Mi Perfil</h1>

      <p><strong>Nombre:</strong> {user.NOMBRE}</p>
      <p><strong>Email:</strong> {user.CORREO}</p>
      <p><strong>RUT:</strong> {user.RUT}</p>

      <br />
      <a href="/profile/edit">Editar Perfil</a>
    </div>
    </>
  );
}

