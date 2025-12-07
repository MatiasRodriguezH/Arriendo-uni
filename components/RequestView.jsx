"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/requestview.module.css";

// Función para crear slug desde un nombre
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}

export default function RequestView({ usuarioId, arriendoId, rol }) {
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/request?u=${usuarioId}&r=${arriendoId}`);
        const data = await res.json();
        setSolicitud(data);
      } catch (err) {
        console.error("Error cargando solicitud:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, [usuarioId, arriendoId]);

  if (loading) return <div className={styles["reqd-loading"]}>Cargando solicitud...</div>;
  if (!solicitud) return <div className={styles["reqd-empty"]}>Solicitud no encontrada</div>;

  async function manejarRespuesta(respuesta) {
    try {
      await fetch(`/api/request`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuarioId,
          id_arriendo: arriendoId,
          respuesta
        })
      });

      window.location.reload();
    } catch (err) {
      console.error("Error al actualizar la solicitud:", err);
    }
  }

  return (
    <div className={styles["reqd-container"]}>
      <h1 className={styles["reqd-title"]}>Solicitud de Contacto</h1>
      <p style={{color:'#4c4c4cff', fontSize:'0.9rem', marginTop:'-1.25rem', marginBottom:'1rem'}}>{solicitud.FECHA}</p>
    { rol == "arrendador" && (
      <>
      <span style={{fontSize:'1rem', fontWeight:'bold'}}>Solicitante</span>
      <div className={styles["reqd-row"]}>
        <img src={'/images/' + solicitud.SOLICITANTE_IMAGEN} className={styles["reqd-avatar"]} />
        <a href={`/profile/${solicitud.ID_USUARIO}`} className={styles["reqd-link"]}>
          {solicitud.SOLICITANTE}
        </a>
      </div>
      </>
    )}

    { rol == "estudiante" && (
      <>
      <span style={{fontSize:'1rem', fontWeight:'bold'}}>Arrendador</span>
      <div className={styles["reqd-row"]}>
        <img src={'/images/' + solicitud.ARRENDADOR_IMAGEN} className={styles["reqd-avatar"]} />
        <a href={`/profile/${solicitud.ID_ARRENDADOR}`} className={styles["reqd-link"]}>
          {solicitud.ARRENDADOR}
        </a>
      </div>
      </>
    )}

      {/* Card arriendo */}
      <div className={styles["reqd-card"]}>
        <img src={"/images/" + solicitud.IMAGEN_PORTADA} className={styles["reqd-card-img"]} />

        <div className={styles["reqd-card-body"]}>
          <a
            href={`/rental/${slugify(solicitud.NOMBRE_ARRIENDO)}`}
            className={styles["reqd-card-title"]}
          >
            {solicitud.NOMBRE_ARRIENDO}
          </a>
          <div style={{display:'flex', gap:'10px'}}>
            <div className={styles["reqd-card-tag"]}>{solicitud.TIPO_INMUEBLE}</div>
            <div className={styles["reqd-card-tag"]}>{solicitud.TIPO_ARRIENDO}</div>
          </div>
          <p className={styles["reqd-card-text"]}>Baños: {solicitud.NUM_BANIOS}</p>
          <p className={styles["reqd-card-text"]}>Habitaciones: {solicitud.NUM_HABITACIONES}</p>
        </div>
      </div>

      <div style={{background:'lightgrey', padding:'0.5rem 1rem', borderRadius:'1rem', marginTop:'1rem' }}>
        La solicitud actual esta en estado de: <strong>{solicitud.ESTADO_SOLICITUD}</strong></div>
    { solicitud.ESTADO_SOLICITUD == "aceptado" && rol == 'estudiante' && (
     <div className={styles["reqd-contacts"]}>
         <p style={{color:'#00638e'}}>Teléfono de contacto del arriendo</p>
         {solicitud.TELEFONO_CONTACTO}
         <p style={{color:'#00638e'}}>Correo de contacto del arriendo</p>
        {solicitud.CORREO_CONTACTO}
     </div>
    )}
    { solicitud.ESTADO_SOLICITUD == "aceptado" && rol == 'arrendador' && (
     <div className={styles["reqd-contacts"]}>
         <p style={{color:'#00638e'}}>Teléfono de contacto del solicitante</p>
         {solicitud.TELEFONO_SOLICITANTE}
     </div>
    )}

      {solicitud.ESTADO_SOLICITUD == "pendiente" && (
        <div className={styles["reqd-actions"]}>
          <button className={styles["reqd-btn"] +" "+ styles["aceptar"]} onClick={() => manejarRespuesta("aceptado")}>
            Aceptar
          </button>
          <button className={styles["reqd-btn"] +" "+ styles["rechazar"]} onClick={() => manejarRespuesta("rechazado")}>
            Rechazar
          </button>
        </div>
      )}
    </div>
  );
}
