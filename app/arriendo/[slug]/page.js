import React from "react";
import Header from "@/components/Header";
import ContactButton from "./ContactButton";
import '../../../styles/home.css';

async function fetchArriendo(slug) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/arriendos/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ArriendoPage({ params }) {
  const { slug } = await params;
  const data = await fetchArriendo(slug);

  if (!data) {
    return (
      <div>
        <Header />
        <div className="catalog">
          <h1>Arriendo no encontrado</h1>
          <p>El arriendo "{slug}" no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="catalog">
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
          {/* Imagen principal */}
          <img
            src="/images/example.jpg"
            alt={data.TITULO || data.titulo}
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }}
          />

          {/* Título y tags */}
          <div style={{ marginBottom: "20px" }}>
            <h1 style={{ marginBottom: "10px" }}>{data.TITULO || data.titulo}</h1>
            <div className="tags-container" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div className="tag">
                <span style={{ color: "white" }}>{data.TIPO_INMUEBLE || data.tipo_inmueble}</span>
              </div>
              <div className="tag">
                <span style={{ color: "white" }}>{data.TIPO_ARRIENDO || data.tipo_arriendo}</span>
              </div>
            </div>
          </div>

          {/* Precio destacado */}
          <p style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#00638e", marginBottom: "20px" }}>
            {data.PRECIO || data.precio}
          </p>

          {/* Información general */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
            <div>
              <p style={{ color: "grey", marginBottom: "5px" }}>Habitaciones</p>
              <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {data.NUM_HABITACIONES || data.num_habitaciones}
              </p>
            </div>
            <div>
              <p style={{ color: "grey", marginBottom: "5px" }}>Baños</p>
              <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {data.NUM_BANIOS || data.num_banios}
              </p>
            </div>
          </div>

          {/* Dirección */}
          <div style={{ marginBottom: "30px", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <p style={{ color: "grey", marginBottom: "5px" }}>Dirección</p>
            <p style={{ fontSize: "1.1rem" }}>{data.DIRECCION || data.direccion}</p>
          </div>

          {/* Descripción (si existe) */}
          {data.DESCRIPCION || data.descripcion ? (
            <div style={{ marginBottom: "30px" }}>
              <h2>Descripción</h2>
              <p style={{ lineHeight: "1.6", color: "#333" }}>
                {data.DESCRIPCION || data.descripcion}
              </p>
            </div>
          ) : null}

          {/* Botón de contacto */}
          <ContactButton/>
        </div>
      </div>
    </div>
  );
}