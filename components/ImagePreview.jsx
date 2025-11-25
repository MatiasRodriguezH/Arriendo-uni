import { useState } from "react";

export default function ImagePreview({ imagenUrl, setImagen }) {

  const eliminar = () => {
    setImagen(null);
  };

  if (!imagenUrl) return null; // no muestra nada si no hay imagen

  return (
    <div
      style={{
        position: "relative",
        width: 160,
        height: 160,
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #ccc",
      }}
    >
      <img
        src={'../images/'+imagenUrl}
        alt="preview"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <button
        onClick={eliminar}
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          background: "rgba(0,0,0,0.6)",
          border: "none",
          color: "#fff",
          width: 28,
          height: 28,
          borderRadius: "50%",
          cursor: "pointer",
          textAlign: "center",
          lineHeight: "28px",
          padding: 0,
          fontSize: 18,
        }}
      >
        ×
      </button>
    </div>
  );
}

