"use client";

import { useState, useEffect, useRef } from "react";

export default function ImageUploader({
  multiple = false,
  imageOnChanges, // <-- callback hacia el padre
  maxFiles = Infinity,
}) {
  const [items, setItems] = useState([]); // { file, url }
  const inputRef = useRef(null); // referencia al input

  // Cuando cambian items, avisar al padre con el array de File
  useEffect(() => {
    imageOnChanges?.(items.map((it) => it.file));
  }, [items, imageOnChanges]);

  // Limpieza al desmontar: revocar object URLs
  useEffect(() => {
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.url));
    };
  }, []); // solo al desmontar

  const handleSelectImages = (e) => {
    const selected = Array.from(e.target.files || []);

    if (selected.length === 0) return;

    // crear objetos con url
    const newItems = selected.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setItems((prev) => {
      let next;
      if (multiple) {
        // respetar maxFiles
        next = [...prev, ...newItems].slice(0, maxFiles);
      } else {
        next = newItems.slice(0, 1);
      }

      // revocar URLs que se eliminarán (prev que no estén en next)
      const toRevoke = prev
        .filter((p) => !next.some((n) => n.url === p.url))
        .map((p) => p.url);
      toRevoke.forEach((u) => URL.revokeObjectURL(u));

      return next;
    });

    // Limpiar input para permitir re-subir mismo archivo si se desea
    e.target.value = "";
  };

  function removeImage(index) {
    setItems((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.url);
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleSelectImages}style={{ display: "none" }} // <--- aquí se oculta
      />

      {/* BOTÓN PERSONALIZADO */}
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        style={{
          margin:'2px 0px 0px 1px',
          padding: "7px 14px",
          background: "#00638e",
          color: "white",
          border: "none",
          borderRadius: '0.75vw',
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        {items.length === 0
          ? multiple ? "Seleccionar imágenes": "Seleccionar imágen"
          : `(${items.length}) imágenes seleccionadas`}
      </button>

      {/* PREVIEW DE IMAGENES */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        {items.map((it, i) => (
          <div
            key={it.url}
            style={{
              position: "relative",
              width: 140,
              height: 140,
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #ddd",
            }}
          >
            <img
              src={it.url}
              alt={`preview-${i}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
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
                lineHeight: "28px",
                textAlign: "center",
                padding: 0,
              }}
              title="Eliminar imagen"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
