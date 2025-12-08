"use client";
import "./../styles/rentalview.css";
import Link from "next/link";

export default function Rentalview({ data }) {
  const href = `/rental/${data?.ID_ARRIENDO}`;
  
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
          <img src={`/images/${data?.IMAGEN_PORTADA || 'example.jpg'}`} alt={data?.TITULO || "arriendo"} />
          <div className="info">
            <span style={{ textAlign: 'start' }}>{data?.TITULO}</span>
            <span style={{ textAlign: 'start', fontWeight: 'bolder', fontSize: '20px'}}>{data?.PRECIO}</span>
            <span style={{ textAlign: 'start' }}>{data?.NUM_HABITACIONES} Habitaciones | {data?.NUM_BANIOS} baños</span>
            <span style={{ textAlign: 'start', color: 'grey' }}>{data?.DIRECCION}</span>
            <span style={{ textAlign: 'start', color: '#00638e' }}>Cercano a {data?.SEDE_CERCANA}</span>
          </div>
        </div>
    </Link>
  );
}