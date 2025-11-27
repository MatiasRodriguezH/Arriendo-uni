"use client";
import styles from "@/styles/inmueblecard.module.css";

export default function InmuebleCard({ inmueble }) {
    return (
        <div className={styles['inmueble-card']}>
        <div className={styles['inmueble-imagen']} style={{width:'30%'}}>
            <img src={inmueble.imagen_portada ? '/images/'+inmueble.imagen_portada :'/images/example.jpg'} alt="" />
        </div>

        <div className={styles['inmueble-info']}>
            <h2>{inmueble.nombre}</h2>
            <p><strong>Baños:</strong> {inmueble.banos}</p>
            <p><strong>Habitaciones:</strong> {inmueble.habitaciones}</p>
            <p><strong>Dirección:</strong> {inmueble.direccion}</p>
        </div>
        </div>
    );
}