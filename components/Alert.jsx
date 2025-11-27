import React from "react";
import "@/styles/alert.css";

export default function AlertModal({ message, onAccept, open, setOpen }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center space-y-4 animate-fadeIn">
        <h2 className="titulo">Alerta</h2>
        <p className="message">{message}</p>

        <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
        <button
          onClick={onAccept}
        >
          Aceptar
        </button>
        <button
          onClick={() => setOpen(false)}
        >
          Cancelar
        </button>
        </div>
      </div>
    </div>
  );
}