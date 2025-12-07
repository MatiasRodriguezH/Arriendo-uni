"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/requestslist.module.css";

export default function MyRequestsList({ idUser }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!idUser) return;

    async function fetchSolicitudes() {
      try {
        const res = await fetch(`/api/user/requests?user=${idUser}`);
        const data = await res.json();
        setSolicitudes(data || []);
      } catch (err) {
        console.error("Error cargando solicitudes:", err);
      }
      setLoading(false);
    }

    fetchSolicitudes();
  }, [idUser]);

  if (loading) return <div className={styles["req-loading"]}>Cargando solicitudes...</div>;

  if (solicitudes.length === 0)
    return <div className={styles["req-empty"]}>No tienes solicitudes pendientes</div>;

  return (
    <div className={styles["req-container"]}>
      <h2 className={styles["req-title"]}>Mis Solicitudes de Contacto</h2>

      {solicitudes.map((s) => (
        <div
          key={s.ID_USUARIO+s.ID_ARRIENDO}
          className={styles["req-item"]}
          onClick={() => router.push(`/request?u=${s.ID_USUARIO}&r=${s.ID_ARRIENDO}`)}
        >
          <p className={styles["req-title-item"]}>
            Solicitaste contacto para el arriendo <strong>{s.NOMBRE_ARRIENDO}</strong>
          </p>
          <div style={{display:'flex', gap:'10px', marginBottom:'2px'}}>
            <div className={styles["req-tag-item"]}>
              {s.TIPO_INMUEBLE}
            </div>
            <div className={styles["req-tag-item"]}>
              {s.TIPO_ARRIENDO}
            </div>
          </div>

          <p className={styles["req-fecha"]}>
            {s.FECHA}
          </p>

          <p className={styles['req-estado'] +" "+styles[`estado-${s.ESTADO_SOLICITUD}`]}>
            {s.ESTADO_SOLICITUD}
          </p>
        </div>
      ))}
    </div>
  );
}
