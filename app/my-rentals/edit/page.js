"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import RoomFormEdit from "@/components/RoomFormEdit";
import InmuebleCard from "@/components/rental/InmuebleCard";
import "@/styles/form.css"
import Alert from "@/components/Alert";

export default function NuevoArriendo() {
    const searchParams = useSearchParams();
    const idArriendo = searchParams.get("id");
    const router = useRouter();

    const [error, setError] = useState("");
    const [alerta, setAlerta] = useState(false);

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
    setHabitaciones(habitaciones.filter((_, i) => i !== index));
  }

  const actualizarHabitacion = useCallback((index, campo, valor) => {
    setHabitaciones(prevHabitaciones => {
        const nuevasHabitaciones = [...prevHabitaciones];
        nuevasHabitaciones[index] = {...nuevasHabitaciones[index],[campo]: valor};
        return nuevasHabitaciones;
    });
  }, []);

  useEffect(()=>{
    async function fecthArriendo(id) {
        const result = await fetch(`/api/edit/rental-get?id=${id}`);
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

  async function eliminarArriendo(){
    const response = await fetch(`/api/delete/rental?id=${idArriendo}`, {method: "DELETE"});
    router.push('/my-rentals');
    setAlerta(false);
  }

  // Envío del formulario
  async function handleSubmit(e) {
    e.preventDefault();

    //Verificar datos de los campos
    if (arriendo.tipo_arriendo == "" || arriendo.titulo =="" || arriendo.precio == ""){
      setError("Campos del arriendo obligatorios no pueden estar vacíos")
      return null;
    }
    if(arriendo.tipo_arriendo == "por habitaciones"){
      if (habitaciones.length == 0){
        setError("Debe existir mínimo una habitación en el arriendo"); 
        return null;
      }
      for (const hab of habitaciones){
        if (!hab.nombre|| !hab.superficie || !hab.precio){
          setError("Campos de habitacion obligatorios no pueden estar vacíos");
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

    const res = await fetch(`/api/edit/rental-post`, {
      method: "POST",
      body: formData
    });

    const resultado = await res.json();
    alert("Arriendo actualizado con exito");
    router.back();
  }

  function Alerta(){
    return(
      <div style={{zIndex:'2',justifySelf:'center',background:'#8c5656ff'}}>Desea eliminar arriendo?</div>
    );
  }

  return (
    <div>
      <Header/>
      <div style={{width:'50vw'}} className="content">
        <h2 style={{justifySelf:'center'}}>Editar arriendo</h2>

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
        ;
          }}
        >
          <option value="" disabled>Selecciona Tipo</option>
          <option value="por completo">Por completo</option>
          <option value="por habitaciones">Por habitaciones</option>
        </select>
        <h4>Título <span style={{ color: "red" }}>*</span></h4>
        <input maxLength={100} style={{width:'100%'}} value={arriendo.titulo} onChange={(e) => {setArriendo({...arriendo, titulo: e.target.value});}}/>
        {arriendo.tipo_arriendo != "por habitaciones" && (
          <>
            <h4>Precio <span style={{ color: "red" }}>*</span></h4>
            <input type="number" max="9999999" min="0" style={{width:'30%'}} value={arriendo.precio} onChange={(e) => {setArriendo({...arriendo, precio: e.target.value});}}/>
          </>
        )}
        <h4>Descripción</h4>
        <textarea maxLength={500} className="descripcion" placeholder="Escribe una descripción de las condiciones del arriendo o los arriendos..." 
        value={arriendo.descripcion || ""} onChange={(e) => {setArriendo({...arriendo, descripcion: e.target.value});}}/>
        
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
                borderRadius: "0.5rem",
                opacity: (habitaciones.length < inmueble.habitaciones)? 1 : 0.5,
                cursor: (habitaciones.length < inmueble.habitaciones)? "pointer" : "not-allowed",
                marginBottom: "15px"
              }}
              disabled={!(habitaciones.length < inmueble.habitaciones)}
              onClick={() => {agregarHabitacion();}}
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

        <Alert message={"¿Desea eliminar arriendo?"} onAccept={()=>eliminarArriendo()} open={alerta} setOpen={setAlerta}/>

        <div style={{display:'flex'}}>
          <button 
            onClick={handleSubmit}
            style={{ padding: "10px 20px", background: "#00638e", color: "#fff", border: "none", borderRadius: "0.5rem", cursor: "pointer"}}
          >
            Guardar Cambios
          </button>
          <button 
            onClick={() => router.push('/my-rentals')}
            style={{ padding: "10px 20px", background: "#00638e", color: "#fff", border: "none", borderRadius: "0.5rem", marginLeft:"1rem", cursor:"pointer" }}
          >
            Cancelar
          </button>
          <button onClick={() => setAlerta(true)}
            style={{ padding: "10px 20px", background: "red", color: "#fff", border: "none", borderRadius: "0.5rem", marginLeft:"auto", cursor:"pointer" }}
          >
            Eliminar Arriendo
          </button>
        </div>
      </div>
    </div>
  );
}


