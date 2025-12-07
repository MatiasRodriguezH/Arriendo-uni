"use client";

import styles from "@/styles/savedrentals.module.css";
import Link from "next/link";

export default function SavedRentals({ arriendos }) {

    const slugify = (text) =>
    text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar tildes
        .replace(/[^a-z0-9\s-]/g, "") // quitar símbolos
        .trim()
        .replace(/\s+/g, "-");

  return (
    <div className={styles["container"]}>
      <h1>Arriendos Guardados</h1>
      {arriendos.length === 0 ? (
        <p className={styles["empty"]}>No tienes arriendos guardados.</p>
      ) : (
        arriendos.map((item) => (
          <Link
            href={`/rental/${slugify(item.TITULO)}`}
            key={item.ID_ARRIENDO}
            className={styles["card"]}
          >
            <div className={styles["image-wrapper"]}>
              <img
                src={"/images/"+ item.IMAGEN_PORTADA}
                alt={item.TITULO}
                className={styles["image"]}
              />
            </div>

            <div className={styles["content"]}>
              <h3 className={styles["title"]}>{item.TITULO}</h3>
              <p className={styles["address"]}>{item.DIRECCION}</p>
              <p className={styles["date"]}>Guardado el {item.FECHA}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
