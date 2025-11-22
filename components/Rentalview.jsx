"use client";
import "./../styles/rentalview.css";
import Link from "next/link";

function slugify(str) {
  if (!str) return "";
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function Rentalview({ data }) {
  const href = `/arriendo/${slugify(data?.TITULO)}`;

  return (
    <Link href={href}>
        <div className="rentview-container">
          <img src='./images/example.jpg' alt={data?.TITULO || "arriendo"} />
          <div className="info">
            <div className="tags-container">
              <div className="tag">
                <span style={{ color: 'white' }}>{data?.TIPO_INMUEBLE}</span>
              </div>
              <div className="tag">
                <span style={{ color: 'white' }}>{data?.TIPO_ARRIENDO}</span>
              </div>
            </div>
            <span style={{ textAlign: 'start' }}>{data?.TITULO}</span>
            <span style={{ textAlign: 'start', fontWeight: 'bolder', fontSize: '1.2vw', marginBottom: '1%' }}>{data?.PRECIO}</span>
            <span style={{ textAlign: 'start' }}>{data?.NUM_HABITACIONES} Habitaciones | {data?.NUM_BANIOS} baños</span>
            <span style={{ textAlign: 'start', color: 'grey' }}>{data?.DIRECCION}</span>
            <span style={{ textAlign: 'start', color: '#00638e' }}>Cercano a X ubicación</span>
          </div>
        </div>
    </Link>
  );
}