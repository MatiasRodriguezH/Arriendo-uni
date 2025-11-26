import { useState } from "react";

/**
 * imagenes: string | Array<string>
 * setImagenes: function para actualizar
 * multiple: boolean → si true permite múltiples imágenes
 */
export default function ImagePreview({ imagenes, setImagenes, multiple = false }) {

  // si no hay imágenes, no muestra nada
  if (!imagenes || (multiple && imagenes.length === 0)) return null;

  // elimina UNA imagen cuando estamos en modo multiple
  const eliminarIndex = (index) => {
    const nuevaLista = imagenes.filter((_, i) => i !== index);
    setImagenes(nuevaLista);
  };

  // elimina la única imagen en modo single
  const eliminarSingle = () => {
    setImagenes(null);
  };

  // --------------------------------------------------------------------
  // MODO MULTIPLE
  // --------------------------------------------------------------------
  if (multiple) {
    return (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {imagenes.map((img, index) => (
          <div
            key={index}
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
              src={"../images/" + img}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            <button
              onClick={() => eliminarIndex(index)}
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
        ))}
      </div>
    );
  }

  // --------------------------------------------------------------------
  // MODO SINGLE
  // --------------------------------------------------------------------
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
        src={"../images/" + imagenes}
        alt="preview"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <button
        onClick={eliminarSingle}
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