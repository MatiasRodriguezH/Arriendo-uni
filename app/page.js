"use client";

import { useEffect, useState, useRef} from "react";
import Header from "../components/Header";
import Rentalview from "../components/Rentalview";
import InputUniversidad from "@/components/InputUniversidad";
import '../styles/home.css'

export default function Home() {
  const [arriendos,setArriendos] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [region, setRegion] = useState("Region");
  const [universidad, setUniversidad] = useState("");
  const dropdownRef = useRef(null);

  // Effect para obtener los arriendos al cargar por primera vez la pagina
  useEffect(()=>{
    async function getArriendos() {
      try {
        const response = await fetch('http://localhost:3000/api/rentals',{cache: "no-store",});
        const data = await response.json();

        setArriendos(data);
      } catch (err) {
        console.error("Error al obtener arriendos:", err);
      }
    }
    getArriendos();
  },[]);

  // Effect para el menu de regiones
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Effect para buscar por universidad especifica
  useEffect(() => {
    async function fetchByUniversity() {
      try {
        const response = await fetch(`http://localhost:3000/api/rentals?universidad=${encodeURIComponent(universidad)}`, {
          cache: "no-store"
        });
        const data = await response.json();
        setArriendos(data);
      } catch (error) {
        console.error("Error filtrando por universidad:", error);
      }
    }

    fetchByUniversity();
  }, [universidad]);

  const handleRegionSelect = (regionNombre) => {
    setRegion(regionNombre);
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
    "Magallanes": 16,
    "Region": 0
  }

  return (
    <div className="page">
      <Header/>
      <div className="contents">
        <div className="uni-search">
          <h1 className="search-titulo">Busca según tu universidad</h1>
          <div className="uni-inputs">
            <div className="button-div">
              <span style={{fontWeight:'700', fontSize:'20px'}}>Ingresa tu region:</span>
              <button className="region-search" type="button" onClick={toggleDropdown}>
                {region}
              </button>
              {isDropdownOpen && (
                <div className="region-dropdown" name="dropdown"
                ref={dropdownRef}>
                  {Object.keys(regiones).map((regionNombre) => (
                      <button 
                        key={regionNombre}
                        className="dropdown-item" 
                        onClick={() => handleRegionSelect(regionNombre)}
                      >
                        <span className="region-texto">{regionNombre}</span>
                      </button>
                  ))}
                </div>
              )}
            </div>
            <InputUniversidad
              region={region}
              onSelect={(nombreUni) => {
                setUniversidad(nombreUni);
              }}
            />
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
