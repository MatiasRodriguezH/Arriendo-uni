"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Header from "./Header";
import styles from "@/styles/profileview.module.css";

export default function ProfileView() {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Cargando datos...</p>;

  return (
    <>
      <Header/>
      <div className={styles.container}>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <h1>Mi Perfil</h1>
          <div className={styles["profile-picture"]}>
            <img src="/images/profile_pictures/example.jpg"/>
          </div>
          <h2>{user.NOMBRE +" "+ user.APELLIDO1 +" "+ user.APELLIDO2}</h2>
          <p>{user.ROL_USUARIO.charAt(0).toUpperCase() + user.ROL_USUARIO.slice(1)}</p>
          <p>{user.RUT}</p>
        </div>

        <div className={styles["profile-info"]}>
          <label>Correo electronico</label>
          <p>{user.CORREO}</p>
          <label>Teléfono</label>
          <p>{user.TELEFONO || "-"}</p>
        </div>

        <br />
        <a href="/profile/edit">Editar Perfil</a>
      </div>
    </>
  );
}
