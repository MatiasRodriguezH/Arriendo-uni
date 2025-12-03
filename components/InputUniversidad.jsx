"use client";

import { useEffect, useState, useRef } from "react";
import "../styles/inputUniversidad.css";

export default function InputUniversidad({ region, onSelect }) {
  const [texto, setTexto] = useState("");
  const [universidades, setUniversidades] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch automático al cambiar región
  useEffect(() => {
    async function fetchUniversidades() {
      try {
        const res = await fetch(`/api/data/universities?region=${encodeURIComponent(region)}`);
        const data = await res.json();
        setUniversidades(data);
      } catch (err) {
        console.error("Error obteniendo universidades:", err);
      }
    }
    console.log("Universidades: ", universidades);
    fetchUniversidades();
    setTexto("");
    setFiltradas([]);
  }, [region]);

  const handleChange = (e) => {
    const value = e.target.value;
    setTexto(value);

    const f = universidades.filter((u) =>
      u.NOMBRE.toLowerCase().includes(value.toLowerCase())
    );
    setFiltradas(f);
    setOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filtradas.length > 0) {
      const first = filtradas[0];
      setTexto(first.NOMBRE);
      onSelect(first.NOMBRE);
      setOpen(false);
    }
  };

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const seleccionar = (u) => {
    setTexto(u.NOMBRE);
    onSelect(u.ID_UNIVERSIDAD);
    setOpen(false);
  };

  return (
    <div className="uni-container" ref={dropdownRef}>
      <h4 className="uni-label">Ingresa tu Universidad:</h4>

      <input
        type="text"
        value={texto}
        placeholder="Escribe tu universidad…"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="uni-input"
      />

      {open && filtradas.length > 0 && (
        <div className="uni-dropdown">
          {filtradas.map((u) => (
            <div
              key={u.ID_UNIVERSIDAD}
              onClick={() => seleccionar(u)}
              className="uni-item"
            >
              {u.NOMBRE}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
