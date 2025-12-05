"use client";

import { useEffect, useState } from "react";
import "@/styles/notificationslist.css";
import { useRouter } from "next/navigation";

export default function NotificationsList({ idUser }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  console.log(idUser);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/notifications?id=${idUser}`);
        const data = await res.json();
        setNotificaciones(data || []);
        setCargando(false);
      } catch (error) {
        console.error("Error cargando notificaciones:", error);
      }
    }

    fetchData();
  }, [idUser]);

  async function marcarLeida(id) {
    try {
      await fetch(`/api/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      setNotificaciones((prev) =>
        prev.map((n) =>
          n.ID_NOTIFICACION === id ? { ...n, ESTADO: 'leido' } : n
        )
      );
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  }

  if (cargando)
    return <div className="notif-loading">Cargando notificaciones...</div>;

  if (notificaciones.length === 0)
    return <div className="notif-empty">No tienes notificaciones</div>;

  return (
    <>
    <div className="notif-container">
      <h2 className="notif-title">Tus Notificaciones</h2>

      {notificaciones.map((n) => (
        <div
          key={n.ID_NOTIFICACION}
          className={`notif-item ${n.ESTADO == "leido" ? "leida" : "no-leida"}`}
        >
          <div className="notif-info">
            <p className="notif-titulo">{n.TITULO}</p>
            <p className="notif-text">{n.MENSAJE}</p>

            {/* Mostrar precios si aplica */}
            {n.PRECIO_ANTERIOR && (
              <p className="notif-precio">
                Precio anterior: ${n.PRECIO_ANTERIOR}
              </p>
            )}
            {n.PRECIO_NUEVO && (
              <p className="notif-precio">
                Precio nuevo: ${n.PRECIO_NUEVO}
              </p>
            )}

            <p className="notif-fecha">
              {n.FECHA}
            </p>
          </div>

          <div style={{display:'flex', gap:'10px'}}>
            {(n.ESTADO == "nuevo") && (
                <button
                className="notif-btn"
                onClick={() => marcarLeida(n.ID_NOTIFICACION)}
                >
                Marcar como leída
                </button>
            )}
            <button
                className="notif-btn"
                onClick={() => router.push(n.ENLACE)}
                >
                Ir
            </button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
