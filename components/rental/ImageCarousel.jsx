"use client";
import { useState } from "react";
import styles from "@/styles/imagecarousel.module.css";

export default function ImageCarousel({ images }) {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={styles["carousel-container"]}>
      <button className={styles["carousel-btn"]+" "+styles["left"]} onClick={prev}>❮</button>

      <img
        className={styles["carousel-image"]}
        src={'/images/'+images[index]}
        alt={`img-${index}`}
      />

      <button className={styles["carousel-btn"]+" "+styles["right"]} onClick={next}>❯</button>

      <div className={styles["carousel-dots"]}>
        {images.map((_, i) => (
          <span
            key={i}
            className={styles["carousel-dot"]+" "+styles[`${i === index ? "active" : ""}`]}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  );
}
