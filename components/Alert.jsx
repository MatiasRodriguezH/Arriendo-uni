import React from "react";
import styles from "@/styles/alert.module.css";

export default function AlertModal({ message, onAccept, open, setOpen }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center space-y-4 animate-fadeIn">
        <h2 className={styles.titulo}>Alerta</h2>
        <p className={styles.message}>{message}</p>

        <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
        <button
          className={styles.button}
          onClick={onAccept}
        >
          Aceptar
        </button>
        <button
          className={styles.button}
          onClick={() => setOpen(false)}
        >
          Cancelar
        </button>
        </div>
      </div>
    </div>
  );
}