"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import "@/styles/nuevo_arriendo.css"
import RoomForm from "@/components/RoomForm";
import ImageUploader from "@/components/ImageUploader";

export default function NuevoArriendo() {
  const [inmuebles, setInmuebles] = useState([]);
  const [usarExistente, setUsarExistente] = useState(true);

  // Inmueble nuevo o seleccionado
  const [selectedInmueble, setSelectedInmueble] = useState("");
  const [nuevoInmueble, setNuevoInmueble] = useState({
    tipo_inmueble: "",
    modalidad: "",
    nombre: "",
    propietario: "",
    descripcion: "",
    num_habitaciones: "",
    num_banios: "",
  });

  // Dirección
  const [direccion, setDireccion] = useState({
    calle: "",
    numero: "",
    ciudad: "",
    region: "",
    adicional:""
  });
  const [regiones, setRegiones] = useState([])

  useEffect(() => {
    async function fetchRegiones() {
      const result = await fetch("http://localhost:3000/api/data/regions");
      const data = await result.json();
      setRegiones(data);
    }
    async function fetchInmuebles(id){
      const result = await fetch(`http://localhost:3000/api/data/user-properties?id=${id}`);
      const data = await result.json();
      setInmuebles(data);
    }
    fetchRegiones();
    fetchInmuebles(2);
  }, []);

  // Contacto
  const [nuevoContacto, setNuevoContacto] = useState(false);
  const [contacto, setContacto] = useState({
    origen_contacto: "",
    telefono: "",
    correo: ""
  });

  // Datos del arriendo
  const [arriendo, setArriendo] = useState({
    tipo_arriendo: "",
    titulo: "",
    precio: "",
    descripcion: ""
  });

  // Datos de las habitaciones
  const [habitaciones, setHabitaciones] = useState([]);
  function agregarHabitacion() {
    setHabitaciones([
      ...habitaciones,
      { nombre: "", superficie: "", descripcion: "", precio: "", imagen_portada: null }
    ]);
  }

  function eliminarHabitacion(index) {
    setHabitaciones(habitaciones.filter((_, i) => i !== index));
  }

  const actualizarHabitacion = useCallback((index, campo, valor) => {
    setHabitaciones(prevHabitaciones => {
        const nuevasHabitaciones = [...prevHabitaciones];
        nuevasHabitaciones[index] = {...nuevasHabitaciones[index],[campo]: valor};
        return nuevasHabitaciones;
    });
  }, []);

  // Imágenes
  const [imgPortadaInmueble, setImgPortadaInmueble] = useState(null);
  const [imgInmueble, setImgInmueble] = useState(null);

  // Envío del formulario
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("usarExistente", usarExistente);
    if (usarExistente) {
      formData.append("id_inmueble", selectedInmueble);
    } else {
      formData.append("nuevoInmueble", JSON.stringify(nuevoInmueble));
      formData.append("direccion", JSON.stringify(direccion));
      formData.append("contacto", JSON.stringify(contacto));
    }
    formData.append("arriendo", JSON.stringify(arriendo));
    if (arriendo.tipo_arriendo==="por habitaciones"){
      formData.append("habitaciones", JSON.stringify(habitaciones));
      habitaciones.forEach((hab, i) => {
        if (hab.imagen_portada instanceof File) {
          formData.append(`imgHabitacion_${i}`, hab.imagen_portada);
        }
      });
    }

    (imgPortadaInmueble) ? formData.append("imgPortadaInmueble", imgPortadaInmueble): formData.append("imgPortadaInmueble", null);
    if (imgInmueble) {
      imgInmueble.forEach((file) => {
        formData.append("imgInmueble", file);
      });
    } else {
      formData.append("imgInmueble", null);
    }

    const res = await fetch(`/api/nuevo/arriendo?user=${2}`, {
      method: "POST",
      body: formData
    });

    const resultado = await res.json();
    console.log("Guardado:", resultado);
    alert("Arriendo creado con éxito");
  }

  function Direccion({direccion, setDireccion}){
    return(
      <>
      <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
        <div style={{display:'flex', flexDirection:'column', width:'70%'}}>
          <h4>Calle <span style={{ color: "red" }}>*</span></h4>
          <input style={{width:'100%'}} onChange={(e) => setDireccion({...direccion, calle: e.target.value})}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', width:'28%'}}>
          <h4>Numero </h4>
          <input style={{width:'100%'}} onChange={(e) => setDireccion({...direccion, numero: e.target.value})}/>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
        <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
          <h4>Ciudad <span style={{ color: "red" }}>*</span></h4>
          <input style={{width:'100%'}} onChange={(e) => setDireccion({...direccion, ciudad: e.target.value})}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
          <h4>Región <span style={{ color: "red" }}>*</span></h4>
          <select style={{width: "100%", height:'100%'}} value={direccion.region} onChange={(e) => setDireccion({...direccion,region: e.target.value})}>
            <option value="" disabled>Selecciona Región</option>
            {regiones.map(reg => (<option value={reg.ID_REGION }>{reg.NOMBRE}</option>))}
          </select>
        </div>
      </div>
      <h4>Dirección adicional</h4>
      <input style={{width:'100%', marginBottom:'1%'}} onChange={(e) => setDireccion({...direccion, adicional: e.target.value})}/>
      </>
    )
  }

  function Contacto({contacto, setContacto}){
    return(
      <div style={{marginBottom:'1%'}}>
      <h4>Usar medios de contacto</h4>
      <select
        style={{width: "50%"}}
        value={nuevoContacto ? "arriendo" : "arrendador"}
        onChange={(e) => {setNuevoContacto(e.target.value === "arriendo"); 
          setContacto({...contacto, origen_contacto: e.target.value});
        }}>
        <option value="arrendador">De la propia cuenta</option>
        <option value="arriendo">Nuevos para el arriendo</option>
      </select>

      {nuevoContacto && (
      <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
        <div style={{display:'flex', flexDirection:'column', width:'28%'}}>
          <h4>Teléfono <span style={{ color: "red" }}>*</span></h4>
          <input style={{width:'100%'}} onChange={(e) => setContacto({...contacto, telefono: e.target.value})}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', width:'70%'}}>
          <h4>Correo electrónico</h4>
          <input style={{width:'100%'}} onChange={(e) => setContacto({...contacto, correo: e.target.value})}/>
        </div>
      </div>
    )}
      </div>
    )
  }

  return (
    <div>
      <Header/>
      <div className="content">
        <h2>Crear nuevo arriendo</h2>

        {/* Selección entre inmueble nuevo o existente */}
        <div style={{ marginTop: "20px", marginBottom: "20px", background: "#fff" }}>
          <h4>Arrendar para un</h4>
          <select
            style={{
              width: "100%"
            }}
            value={usarExistente ? "existente" : "nuevo"}
            onChange={(e) => setUsarExistente(e.target.value === "existente")}
          >
            <option value="existente">Inmueble existente</option>
            <option value="nuevo">Nuevo inmueble</option>
          </select>
        </div>

        {/* Seleccionar inmueble existente */}
        {usarExistente ? (
          <div>
            <h3>Seleccionar inmueble <span style={{ color: "red" }}>*</span></h3>
            <select 
              value = {selectedInmueble}
              style={{ width: "100%" }}
              onChange={(e) => setSelectedInmueble(e.target.value)}
            >
              <option value="" disabled>Seleccione...</option>
              {inmuebles.map((i) => (
                <option key={i.ID_INMUEBLE} value={i.ID_INMUEBLE}>
                  {i.NOMBRE} - {i.DIRECCION}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <h3>Datos del inmueble</h3>
            <hr/>
            <h4>Tipo de Inmueble <span style={{ color: "red" }}>*</span> </h4>
            <select
              style={{width:'50%'}}
              value={nuevoInmueble.tipo_inmueble}
              onChange={(e) => setNuevoInmueble({ ...nuevoInmueble, tipo_inmueble: e.target.value })}
            >
              <option value="" disabled>Selecciona Tipo</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
            </select>
            <h4>Nombre del inmueble <span style={{ color: "red" }}>*</span> </h4>
            <input style={{width:'100%'}} onChange={(e) => setNuevoInmueble({...nuevoInmueble, nombre: e.target.value})}/>
            <h4>Propietario</h4>
            <input  style={{width:'100%'}} onChange={(e) => setNuevoInmueble({...nuevoInmueble, propietario: e.target.value})}/>
            <h4>Descripción</h4>
            <textarea className="descripcion" placeholder="Escribe una descripción del inmueble..." onChange={(e) => setNuevoInmueble({...nuevoInmueble, descripcion: e.target.value})}/>
            <div style={{display:'flex', flexDirection:'row', gap:'2%', marginBottom:'1%'}}>
              <div style={{display:'flex', flexDirection:'column'}}>
                <h4>Numero de habitaciones <span style={{ color: "red" }}>*</span> </h4>
                <input type="number" min='0' onChange={(e) => setNuevoInmueble({...nuevoInmueble, num_habitaciones: e.target.value})}/>
              </div>
              <div style={{display:'flex', flexDirection:'column'}}>
              <h4>Numero de baños <span style={{ color: "red" }}>*</span> </h4>
              <input type="number" min='0' onChange={(e) => setNuevoInmueble({...nuevoInmueble, num_banios: e.target.value})}/>
              </div>
            </div>
            
            <h3>Dirección </h3>
            <Direccion direccion={direccion} setDireccion={setDireccion}/>

            <h3>Contacto</h3>
            <Contacto contacto={contacto} setContacto={setContacto}/>

            <h3>Imagenes</h3>
            <h4>Imagen portada del inmueble</h4>
            <ImageUploader imageOnChanges={(files) => setImgPortadaInmueble(files[0])}/>
            <h4>Otras imagenes</h4>
            <ImageUploader imageOnChanges={(files) => setImgInmueble(files)} multiple={true}/>
          </>
        )}

        {/* Datos del arriendo */}
          
        <h3 style={{ marginTop: "25px" }}>Datos del arriendo</h3>
        <hr/>
        <h4>Tipo de Arriendo <span style={{ color: "red" }}>*</span></h4>
        <select
          style={{width:'50%'}}
          value={arriendo.tipo_arriendo}
          onChange={(e) => {
            const tipo = e.target.value;
            if (tipo === "por completo") setHabitaciones([]);
            if (tipo === "por completo") setArriendo({...arriendo, precio: null});
            setNuevoInmueble({ ...nuevoInmueble, modalidad: e.target.value});
            setArriendo({...arriendo, tipo_arriendo: e.target.value});
          }}
        >
          <option value="" disabled>Selecciona Tipo</option>
          <option value="por completo">Por completo</option>
          <option value="por habitaciones">Por habitaciones</option>
        </select>
        <h4>Título <span style={{ color: "red" }}>*</span></h4>
        <input style={{width:'100%'}} onChange={(e) => setArriendo({...arriendo, titulo: e.target.value})}/>
        {arriendo.tipo_arriendo != "por habitaciones" && (
          <>
            <h4>Precio <span style={{ color: "red" }}>*</span></h4>
            <input type="number" onChange={(e) => setArriendo({...arriendo, precio: e.target.value})}/>
          </>
        )}
        <h4>Descripción</h4>
        <textarea className="descripcion" placeholder="Escribe una descripción de las condiciones del arriendo o los arriendos..." onChange={(e) => setArriendo({...arriendo, descripcion: e.target.value})}/>
        
        {arriendo.tipo_arriendo === "por habitaciones" && (
          <div style={{ marginTop: "30px" }}>
            <h3>Habitaciones <span style={{ color: "red" }}>*</span></h3>

            <button
              type="button"
              style={{
                fontSize:'1vw',
                padding: "7px 10px",
                background: "#00638e",
                color: "white",
                border: "none",
                borderRadius: "0.75vw",
                cursor: "pointer",
                marginBottom: "15px"
              }}
              onClick={agregarHabitacion}
            >
              + Agregar habitación
            </button>

            {/* Lista de habitaciones */}
            {habitaciones.map((hab, index) => (
              <RoomForm hab={hab} index={index} actualizarHabitacion={actualizarHabitacion} eliminarHabitacion={eliminarHabitacion}/>
            ))}
          </div>
        )}

        <br /><br />

        <button 
          onClick={handleSubmit}
          style={{ padding: "10px 20px", background: "blue", color: "#fff", border: "none", borderRadius: "6px" }}
        >
          Crear arriendo
        </button>
      </div>
    </div>
  );
}

