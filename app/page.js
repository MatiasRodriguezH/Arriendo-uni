"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Rentalview from "../components/Rentalview";
import '../styles/home.css'

export default function Home() {
  const [arriendos,setArriendos] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(()=>{
    async function get_data() {
      try {
        const response = await fetch('http://localhost:3000/api/rentals',{cache: "no-store",});
        const data = await response.json();

        setArriendos(data);
      } catch (err) {
        console.error("Error al obtener arriendos:", err);
      }
    }

    get_data();
  },[]);

  const handleRegionSelect = (regionNombre) => {
    console.log(`Región seleccionada: ${regionNombre}`);
    // Aquí puedes añadir la lógica para filtrar los arriendos
    setIsDropdownOpen(false); // Cierra el dropdown después de la selección
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  }

  const regiones = {
    "Arica": 2,
    "Maule": 1,
    "Tarapacá": 3,
    "Antofagasta": 4,
    "Atacama": 5,
    "Coquimbo": 6,
    "Valparaíso": 7,
    "Metropolitana": 8,
    "Ñuble": 10,
    "O'Higgins": 9, 
    "Biobío": 11,
    "La Araucanía": 12,
    "Los Rios": 13,
    "Los Lagos": 14,
    "Aysén": 15,
    "Magallanes": 16
  }

  return (
    <div className="page">
      <Header/>
      <div className="content">
        <div className="uni-search">
          <h1 className="search-titulo">Busca según tu universidad</h1>
          <div className="uni-inputs">
            <div className="button-div">
              {/* 2. Asignamos la función toggleDropdown al click del botón principal */}
              <button className="region-search" type="button" onClick={toggleDropdown}>
                Region
              </button>
              {/* 3. Renderizado Condicional: El div solo se muestra si isDropdownOpen es true */}
              {isDropdownOpen && (
                <div className="region-dropdown" name="dropdown">
                  <ul>
                  {Object.keys(regiones).map((regionNombre) => (
                    <li key={regionNombre}>
                      {/* 4. Usamos handleRegionSelect en los botones del dropdown */}
                      <button 
                        className="dropdown-item" 
                        onClick={() => handleRegionSelect(regionNombre)}
                      >
                        {regionNombre}
                      </button>
                    </li>
                  ))}
                  </ul>
                </div>
              )}
            </div>
            <input className="universidad" type="text" name="universidad" placeholder="Universidad Católica del Maule"></input>
          </div>
        </div>
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
