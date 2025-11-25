"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import "@/styles/nuevo_arriendo.css"
import RoomFormEdit from "@/components/RoomFormEdit";

export default function NuevoArriendo() {
    const searchParams = useSearchParams();
    const idArriendo = searchParams.get("id");

    const[cambios, setCambios] = useState(false);
    const [error, SetError] = useState("");

  // Datos del inmueble asociado
  const [inmueble, setInmueble] = useState({
    nombre: "",
    banos: 0,
    habitaciones: 0,
    direccion: "",
    imagen_portada: ""
    });

  // Datos del arriendo
  const [arriendo, setArriendo] = useState({
    id_arrriendo: "",
    id_inmueble: "",
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
      {id: null, nombre: "", superficie: 0, descripcion: "", precio: 0, imagen_portada: null }
    ]);
  }

  function eliminarHabitacion(index) {
    setCambios(true);
    setHabitaciones(habitaciones.filter((_, i) => i !== index));
  }

  const actualizarHabitacion = useCallback((index, campo, valor) => {
    setCambios(true);
    setHabitaciones(prevHabitaciones => {
        const nuevasHabitaciones = [...prevHabitaciones];
        nuevasHabitaciones[index] = {...nuevasHabitaciones[index],[campo]: valor};
        return nuevasHabitaciones;
    });
  }, []);

  useEffect(()=>{
    async function fecthArriendo(id) {
        const result = await fetch(`/api/edit/arriendo-get?id=${id}`);
        const data = await result.json();
        setArriendo({
            id_arriendo: data.ID_ARRIENDO,
            id_inmueble: data.ID_INMUEBLE,
            tipo_arriendo: data.TIPO_ARRIENDO,
            titulo: data.TITULO,
            precio: data.PRECIO,
            descripcion: data.DESCRIPCION
        });
        setHabitaciones(
        data.HABITACIONES.map(hab => ({
            id: hab.ID_HABITACION,
            nombre: hab.NOMBRE,
            superficie: hab.SUPERFICIE,
            descripcion: hab.DESCRIPCION,
            precio: hab.PRECIO,
            imagen_portada: hab.IMAGEN_PORTADA
        }))
        );

        setInmueble({nombre: data.NOMBRE,
            banos: data.NUM_BANIOS,
            habitaciones: data.NUM_HABITACIONES,
            direccion: data.DIRECCION,
            imagen_portada: data.NOMBRE_IMAGEN
        });
    }
    fecthArriendo(idArriendo);
  },[]);

    function InmuebleCard({ inmueble }) {
    return (
        <div className="inmueble-card">
        <div className="inmueble-imagen" style={{width:'30%'}}>
            <img src={inmueble.imagen_portada ? inmueble.imagen_portada :'../images/example.jpg'} alt="" />
        </div>

        <div className="inmueble-info">
            <h2>{inmueble.nombre}</h2>
            <p><strong>Baños:</strong> {inmueble.banos}</p>
            <p><strong>Habitaciones:</strong> {inmueble.habitaciones}</p>
            <p><strong>Dirección:</strong> {inmueble.direccion}</p>
        </div>

        <style jsx>{`
            .inmueble-card {
            display: flex;
            flex-direction: row;
            gap: 20px;
            width: 100%;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 10px;
            background: #fff;
            margin-top: 10px;
            }

            .inmueble-imagen img {
            width: 100%;
            height: 120px;
            background-color: grey;
            object-fit: cover;
            border-radius: 8px;
            }

            .inmueble-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 6px;
            flex: 1;
            }

            .inmueble-info h2 {
            margin: 0;
            font-size: 1vw;
            }

            .inmueble-info p {
            margin: 0;
            font-size: 0.9vw
            }
        `}</style>
        </div>
    );
    }

  // Envío del formulario
  async function handleSubmit(e) {
    e.preventDefault();

    //Verificar datos de los campos
    if (arriendo.tipo_arriendo == "" || arriendo.titulo =="" || arriendo.precio == ""){
      SetError("Campos del arriendo obligatorios no pueden estar vacíos")
      return null;
    }
    if(arriendo.tipo_arriendo == "por habitaciones"){
      if (habitaciones.length == 0){
        SetError("Debe existir mínimo una habitación en el arriendo"); 
        return null;
      }
      for (const hab of habitaciones){
        if (!hab.nombre|| !hab.superficie || !hab.precio){
          SetError("Campos de habitacion obligatorios no pueden estar vacíos");
          return null;
        }
      };
    }

    const formData = new FormData();

    formData.append("arriendo", JSON.stringify(arriendo));
    if (arriendo.tipo_arriendo==="por habitaciones"){
      formData.append("habitaciones", JSON.stringify(habitaciones));
      habitaciones.forEach((hab, i) => {
        if (hab.imagen_portada instanceof File) {
          formData.append(`imgHabitacion_${i}`, hab.imagen_portada);
        }
      });
    }

    const res = await fetch(`/api/edit/arriendo-post`, {
      method: "POST",
      body: formData
    });

    const resultado = await res.json();
    alert("Arriendo actualizado con exito");
  }

  return (
    <div>
      <Header/>
      <div className="content">
        <h2>Editar arriendo</h2>

        <InmuebleCard inmueble={inmueble}/>

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
            setArriendo({...arriendo, tipo_arriendo: e.target.value});
            setCambios(true);
          }}
        >
          <option value="" disabled>Selecciona Tipo</option>
          <option value="por completo">Por completo</option>
          <option value="por habitaciones">Por habitaciones</option>
        </select>
        <h4>Título <span style={{ color: "red" }}>*</span></h4>
        <input style={{width:'100%'}} value={arriendo.titulo} onChange={(e) => {setArriendo({...arriendo, titulo: e.target.value}); setCambios(true);}}/>
        {arriendo.tipo_arriendo != "por habitaciones" && (
          <>
            <h4>Precio <span style={{ color: "red" }}>*</span></h4>
            <input type="number" value={arriendo.precio} onChange={(e) => {setArriendo({...arriendo, precio: e.target.value}); setCambios(true);}}/>
          </>
        )}
        <h4>Descripción</h4>
        <textarea className="descripcion" placeholder="Escribe una descripción de las condiciones del arriendo o los arriendos..." 
        value={arriendo.descripcion} onChange={(e) => {setArriendo({...arriendo, descripcion: e.target.value}); setCambios(true);}}/>
        
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
                opacity: (habitaciones.length < inmueble.habitaciones)? 1 : 0.5,
                cursor: (habitaciones.length < inmueble.habitaciones)? "pointer" : "not-allowed",
                marginBottom: "15px"
              }}
              disabled={!(habitaciones.length < inmueble.habitaciones)}
              onClick={() => {agregarHabitacion(); setCambios(true);}}
            >
              + Agregar habitación
            </button>

            {/* Lista de habitaciones */}
            {habitaciones.map((hab, index) => (
              <RoomFormEdit hab={hab} index={index} actualizarHabitacion={actualizarHabitacion} eliminarHabitacion={eliminarHabitacion}/>
            ))}
          </div>
        )}

        <br />
        <div style={{margin:"1% 0% 2% 0%"}}>
          <span style={{color:'red', fontSize:'1vw'}}>{error}</span>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!cambios}
          style={{ padding: "10px 20px", background: "blue", color: "#fff", border: "none", borderRadius: "6px", opacity: cambios? 1:0.5, cursor: cambios? "pointer":"not-allowed"}}
        >
          Guardar Cambios
        </button>
        <button 
          onClick={() => window.location.replace("/")}
          style={{ padding: "10px 20px", background: "blue", color: "#fff", border: "none", borderRadius: "6px", marginLeft:"2%", cursor:"pointer" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}


