"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Rentalview from "../components/Rentalview";
import '../styles/home.css'

export default function Home() {
  const [arriendos,setArriendos] = useState([]);

  useEffect(()=>{
    async function get_data() {
      try {
        const response = await fetch('http://localhost:3000/api/arriendos',{cache: "no-store",});
        const data = await response.json();

        console.log("Respuesta completa:", data);
        console.log("data.results:", data.results);

        setArriendos(data.results);
      } catch (err) {
        console.error("Error al obtener arriendos:", err);
      }
    }

    get_data();
  },[]);

  return (
    <div>
      <Header/>
        <div className="catalog">
          <span style={{fontSize:'125%', fontWeight:'bold', marginBottom:'-3%'}}>Principales Arriendos</span>
          <div className="catalog items">
            {arriendos.length > 0 ? (
              arriendos.map((arriendo, index) => (
                <Rentalview key={index} data={arriendo} />
              ))
            ) : (
              <p>Cargando arriendos...</p>
            )}
          </div>
        </div>
    </div>
  );
}
