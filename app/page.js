"use client";

import { useEffect, useState, useRef} from "react";
import Header from "../components/Header";
import Rentalview from "../components/Rentalview";
import InputUniversidad from "@/components/InputUniversidad";
import PriceRangeSlider from "@/components/PriceSlider";
import '../styles/home.css'

export default function Home() {
  const [arriendos, setArriendos] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [region, setRegion] = useState("Region");
  const [universidad, setUniversidad] = useState("");
  const dropdownRef = useRef(null);
  
  // Estados para los filtros (valores temporales)
  const [tipoArriendo, setTipoArriendo] = useState("");
  const [tipoInmueble, setTipoInmueble] = useState("");
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(1000000);
  const [distanciaMax, setDistanciaMax] = useState("");

  // Effect para obtener los arriendos al cargar por primera vez la pagina
  useEffect(() => {
    async function getArriendos() {
      try {
        const response = await fetch('http://localhost:3000/api/rentals', {cache: "no-store"});
        const data = await response.json();
        setArriendos(data);
      } catch (err) {
        console.error("Error al obtener arriendos:", err);
      }
    }
    getArriendos();
  }, []);

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

  useEffect(() => {
    if (universidad) {
      handleBuscar();
    }
  }, [universidad])

  // Función para buscar con filtros (se ejecuta al hacer clic en "Buscar")
  async function handleBuscar() {
    try {
      const params = new URLSearchParams();

      if (universidad) params.append("universidad", universidad);
      if (tipoInmueble) params.append("inmueble", tipoInmueble);
      if (tipoArriendo) params.append("tipo", tipoArriendo);
      params.append("precioMin", precioMin);
      params.append("precioMax", precioMax);
      if (distanciaMax) params.append("distanciaMax", distanciaMax);

      const response = await fetch(
        `http://localhost:3000/api/rentals?${params.toString()}`,
        { cache: "no-store" }
      );

      const data = await response.json();
      setArriendos(data);

    } catch (error) {
      console.error("Error filtrando:", error);
    }
  }

  const handleRegionSelect = (regionNombre) => {
    setRegion(regionNombre);
    setIsDropdownOpen(false);
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
          <div className="uni-search">
            <h1 className="search-titulo">Bienvenido a TuCampus</h1>
            <div className="uni-inputs">
              <div className="button-div">
                <span style={{fontWeight:'700', fontSize:'20px'}}>Ingresa tu region:</span>
                <button className="region-search" type="button" onClick={toggleDropdown}>
                  {region}
                </button>
                {isDropdownOpen && (
                  <div className="region-dropdown" name="dropdown" ref={dropdownRef}>
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
                  setUniversidad(nombreUni)
                }}
              />
            </div>
          </div>
      <div className="page-content">
        <div className="contents">
          <div className="search-page">
            <div className="search">
              <h3 className="type-title">Tipo Inmueble</h3>
              <select className="type-filter" value={tipoInmueble} onChange={(e) => setTipoInmueble(e.target.value)}>
                <option value="">- - -</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
              </select>
              <h3 className="type-title">Tipo Arriendo</h3>
              <select className="type-filter" value={tipoArriendo} onChange={(e) => setTipoArriendo(e.target.value)}>
                <option value="">- - -</option>
                <option value="por completo">Por completo</option>
                <option value="por habitaciones">Por habitaciones</option>
              </select>
              <PriceRangeSlider
                min={0}
                max={1000000}
                step={5000}
                valueMin={precioMin}
                valueMax={precioMax}
                onChangeMin={setPrecioMin}
                onChangeMax={setPrecioMax}
              />
              <button 
                onClick={handleBuscar}
                className="filter-button"
              >
                Aplicar Filtros
              </button>
            </div>
            <div className="catalog">
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
    </div>
  );
}