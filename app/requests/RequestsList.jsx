"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/requestslist.module.css";

export default function RequestsList({ idUser }) {
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

  async function manejarAccion(respuesta) {
    try {
      await fetch(`/api/user/requests`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: idUser, respuesta }) // "aceptado" | "rechazado"
      });

      setSolicitudes((prev) =>
        prev.map((sol) =>
          sol.ESTADO_SOLICITUD == "pendiente"
            ? { ...sol, ESTADO_SOLICITUD: respuesta }
            : sol
        )
      );
    } catch (err) {
      console.error("Error al procesar solicitudes:", err);
    }
  }

  if (loading) return <div className={styles["req-loading"]}>Cargando solicitudes...</div>;

  if (solicitudes.length === 0)
    return <div className={styles["req-empty"]}>No tienes solicitudes pendientes</div>;

  return (
    <div className={styles["req-container"]}>
      <h2 className={styles["req-title"]}>Solicitudes de Contacto</h2>

      <div className={styles["req-actions"]}>
        <button className={styles["req-btn"]+" "+styles["aceptar"]} onClick={() => manejarAccion("aceptado")}>
          Aceptar todas
        </button>
        <button className={styles["req-btn"]+" "+styles["rechazar"]} onClick={() => manejarAccion("rechazado")}>
          Rechazar todas
        </button>
      </div>

      {solicitudes.map((s) => (
        <div
          key={s.ID_USUARIO+s.ID_ARRIENDO}
          className={styles["req-item"]}
          onClick={() => router.push(`/request?u=${s.ID_USUARIO}&r=${s.ID_ARRIENDO}`)}
        >
          <p className={styles["req-title-item"]}>
            Usuario <strong>{s.SOLICITANTE}</strong> solicito contacto para el arriendo <strong>{s.NOMBRE_ARRIENDO}</strong>
          </p>

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
