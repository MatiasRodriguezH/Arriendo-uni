import React, { useState, useEffect } from "react";
import MapPicker from "./MapPicker";


export default function HqsForm({ sede, instituciones, onClose, onSave, onDelete }) {
    const [nombre, setNombre] = useState("");
    const [institucion, setInstitucion] = useState(sede?.institucion || "");
    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");
    const [regiones,setRegiones] = useState([]);
    const [idRegion, setIdRegion] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [lat, setLat] = useState(sede?.LATITUD || null);
    const [lng, setLng] = useState(sede?.LONGITUD || null);



    
    useEffect(() => {
        async function getRegiones() {
            const res = await fetch("/api/data/regions");
            const data = await res.json();
            setRegiones(data);
        }

        getRegiones();
    
        if (sede) {
            setNombre(sede.NOMBRE);
            setInstitucion(sede.ID_INSTITUCION);
            setCalle(sede.CALLE);
            setNumero(sede.NUMERO);
            setIdRegion(sede.ID_REGION);
            setCiudad(sede.CIUDAD);
            setLat(sede.LATITUD);
            setLng(sede.LONGITUD);
        }
    }, [sede]);

    const handleMapSelect = ({ lat, lng, calle, numero, ciudad, region }) => {
        const regionMap = {
            "región de arica y parinacota": 2,
            "tarapacá": 3,
            "antofagasta": 4,
            "atacama": 5,
            "coquimbo": 6,
            "valparaíso": 7,
            "metropolitana de santiago": 8,
            "libertador general bernardo o'higgins": 9,
            "región del maule": 1,
            "ñuble": 10,
            "biobío": 11,
            "la araucanía": 12,
            "los ríos": 13,
            "los lagos": 14,
            "aisen del general carlos ibáñez del campo": 15,
            "magallanes y de la antártica chilena": 16
        };
        setLat(lat);
        setLng(lng);

        if (calle) setCalle(calle);
        if (numero) setNumero(numero);
        if (ciudad) setCiudad(ciudad);
        let normalized = (region || "").toLowerCase().trim();
        console.log(normalized);

        // Buscar ID en diccionario
        const regionId = regionMap[normalized];

        // Si se encontró → asignar
        if (regionId) {
            setIdRegion(regionId);
        };
    }

    const handleSubmit = () => {
        if(sede){
            const data = { nombre, institucion, calle, numero, ciudad, idRegion, idDireccion: sede.ID_DIRECCION };
            onSave(data);
        }
        else{
            const data = { nombre, institucion, calle, numero, ciudad, idRegion };
            onSave(data);
        }
    };

    return (
        <div className="modal-container">
        <div className="modal-content">
        <h2>{sede ? "Editar Sede" : "Nueva Sede"}</h2>

        <div style={{display: "flex", gap:'1rem'}}>
            <div style={{display: "flex", flexDirection:"column", width:'40%'}}>
            <label>Nombre de la Sede</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>

            <div style={{display: "flex", flexDirection:"column", height:'100%'}}>
            <label>Institución</label>
            <select value={institucion} onChange={(e) => setInstitucion(e.target.value)}>
            <option value="">Seleccione institución</option>
            {instituciones.map((i) => (
            <option key={i.ID_INSTITUCION} value={i.ID_INSTITUCION}>{i.NOMBRE}</option>
            ))}
            </select>
            </div>
        </div>
        
        <div style={{display: "flex", gap:'1rem'}}>
            <div style={{display: "flex", flexDirection:"column", width:'60%'}}>
            <label>Calle</label>
            <input value={calle || ""} onChange={(e) => setCalle(e.target.value)} />
            </div>
            <div style={{display: "flex", flexDirection:"column", width:'40%'}}>
            <label>Número</label>
            <input value={numero || ""} onChange={(e) => setNumero(e.target.value)} />
            </div>
        </div>

        <div style={{display: "flex", gap:'1rem'}}>
            <div style={{display: "flex", flexDirection:"column", width:'60%'}}>
            <label>Región</label>
            <select value={idRegion} onChange={(e) => setIdRegion(e.target.value)}>
            <option value="" disabled>Seleccione región</option>
            {regiones.map((r) => (
                <option key={r.ID_REGION} value={r.ID_REGION}>{r.NOMBRE}</option>
            ))}
            </select>
            </div>

            <div style={{display: "flex", flexDirection:"column", width:'60%'}}>
            <label>Ciudad</label>
            <input value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
            </input>
            </div>
        </div>

        <MapPicker  initialPosition={lat && lng ? [lat, lng] : null}
        onSelectLocation={handleMapSelect}/>

        <div className="btn-group">
        <button className="btn-primary" onClick={handleSubmit}>Guardar</button>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        {sede && (
        <button className="btn-danger" onClick={onDelete}>Eliminar</button>
        )}
        </div>
        </div>
        </div>
    );
}