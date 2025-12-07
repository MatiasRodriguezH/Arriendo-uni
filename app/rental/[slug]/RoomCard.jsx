// components/RoomCard.jsx
"use client";

import Image from "next/image";
import styles from "./roomcard.module.css";

export default function RoomCard({ habitacion }) {
  let { NOMBRE, SUPERFICIE, DESCRIPCION, PRECIO, IMAGEN_PORTADA } = habitacion;
  if (!IMAGEN_PORTADA){
    IMAGEN_PORTADA = "rooms/example.jpg";
  }

  return (
    <div className={styles["room-card"]}>
        <div style={{display:'flex', gap:'1rem'}}>
            <div className={styles["room-card-image"]}>
                <Image
                src={"/images/"+ IMAGEN_PORTADA}
                alt={NOMBRE}
                fill
                style={{ objectFit: "cover" }}
                />
            </div>

            <div className={styles["room-card-info"]}>
                <h2 className={styles["room-card-title"]}>{NOMBRE}</h2>

                <p className={styles["room-card-detail"]}>
                <strong style={{color:"#00638e"}}>Superficie:</strong> {SUPERFICIE} m²
                </p>

                <p className={styles["room-card-price"]}>
                <strong>{PRECIO}</strong>
                </p>
            </div>
        </div>
        <p styles={{marginTop:'0.25rem'}} className={styles["room-card-detail"]}>
            <strong style={{color:"#00638e"}}>Descripción:</strong> {DESCRIPCION || "Sin descripción"}
        </p>
    </div>
  );
}
