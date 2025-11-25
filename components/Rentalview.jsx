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
          <div className="tags-container">
            <div className="tag">
              {data?.TIPO_INMUEBLE}
            </div>
            <div className="tag">
              {data?.TIPO_ARRIENDO}
            </div>
          </div>
          <img src='./images/example.jpg' alt={data?.TITULO || "arriendo"} />
          <div className="info">
            <span style={{ textAlign: 'start' }}>{data?.TITULO}</span>
            <span style={{ textAlign: 'start', fontWeight: 'bolder', fontSize: '20px', marginBottom: '1%' }}>{data?.PRECIO}</span>
            <span style={{ textAlign: 'start' }}>{data?.NUM_HABITACIONES} Habitaciones | {data?.NUM_BANIOS} baños</span>
            <span style={{ textAlign: 'start', color: 'grey' }}>{data?.DIRECCION}</span>
            <span style={{ textAlign: 'start', color: '#00638e' }}>Cercano a X ubicación</span>
          </div>
        </div>
    </Link>
  );
}