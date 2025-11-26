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

        setArriendos(data);
      } catch (err) {
        console.error("Error al obtener arriendos:", err);
      }
    }

    get_data();
  },[]);

  return (
    <div className="page">
      <Header/>
      <div className="content">
        <span className="uni-search">
          <h1 className="search-titulo">Busca según tu universidad</h1>
          <button className="region-search">
            Region
          </button>
          <input type="text" name="universidad" placeholder="Universidad Católica del Maule"></input>
        </span>
        <div className="search-page">
          <span className="search">
            Filtros de busqueda
          </span>
          <div className="catalog">
            <span style={{fontSize:'125%', fontWeight:'bold', margin:'15px 0 0 15px',}}>Principales Arriendos</span>
            <div className="catalog-items">
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
      </div>
    </div>
  );
}
