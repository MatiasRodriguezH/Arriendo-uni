import React, { useState, useEffect } from "react";


export default function HqsForm({ sede, instituciones, onClose, onSave, onDelete }) {
    const [nombre, setNombre] = useState("");
    const [institucion, setInstitucion] = useState(sede?.institucion || "");
    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");
    const [regiones,setRegiones] = useState([]);
    const [idRegion, setIdRegion] = useState("");
    const [ciudad, setCiudad] = useState("");

    
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
        }
    }, [sede]);


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


        <label>Nombre de la Sede</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />


        <label>Institución</label>
        <select value={institucion} onChange={(e) => setInstitucion(e.target.value)}>
        <option value="">Seleccione institución</option>
        {instituciones.map((i) => (
        <option key={i.ID_INSTITUCION} value={i.ID_INSTITUCION}>{i.NOMBRE}</option>
        ))}
        </select>


        <h3>Dirección</h3>
        <label>Calle</label>
        <input value={calle} onChange={(e) => setCalle(e.target.value)} />


        <label>Número</label>
        <input value={numero} onChange={(e) => setNumero(e.target.value)} />


        <label>Región</label>
        <select value={idRegion} onChange={(e) => setIdRegion(e.target.value)}>
        <option value="" disabled>Seleccione región</option>
        {regiones.map((r) => (
            <option key={r.ID_REGION} value={r.ID_REGION}>{r.NOMBRE}</option>
        ))}
        </select>


        <label>Ciudad</label>
        <input value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
        </input>


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