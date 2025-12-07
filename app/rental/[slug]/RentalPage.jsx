"use client";

import { useRouter } from "next/navigation";
import ImageCarousel from "@/components/rental/ImageCarousel";
import '@/styles/rental.css';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import RoomCard from "./RoomCard";

export default function RentalPage({rental}){
    const {user, loading} = useContext(AuthContext);
    const [solicitud, setSolicitud] = useState("");
    const [guardado, setGuardado] = useState(false);
    const router = useRouter();

    async function solicitudContacto(idUsuario) {
      if (!idUsuario) return;

      const res = await fetch(`/api/request`,
        { method:"POST",
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({id_usuario: idUsuario, id_arriendo: rental.ID_ARRIENDO})
        }
      );
      setSolicitud({ESTADO_SOLICITUD:"pendiente"});
    }

    async function guardarArriendo(idUsuario) {
      setGuardado(true);
      await fetch(`/api/interaction`,
        { method:"POST",
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({id_usuario: idUsuario, id_arriendo: rental.ID_ARRIENDO, interaccion: "guardado"})
        }
      );
    }
    async function eliminarGuardado(idUsuario) {
      setGuardado(false);
      await fetch(`/api/interaction`,
        { method:"DELETE",
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({id_usuario: idUsuario, id_arriendo: rental.ID_ARRIENDO})
        }
      );
    }

    useEffect(()=>{
      async function fetchSolicitud() {
        const consut = await fetch(`/api/request?u=${user.ID_USUARIO}&r=${rental.ID_ARRIENDO}`);
        const request = await consut.json()
        setSolicitud(request);
      }
      async function fetchGuardado() {
        const consut = await fetch(`/api/interaction?u=${user.ID_USUARIO}&r=${rental.ID_ARRIENDO}`);
        const interaction = await consut.json()
        if (interaction && interaction[2] == "guardado"){
          setGuardado(!guardado);
        }
      }
      if (!loading && user){
        fetchSolicitud();
        fetchGuardado();
      }
    },[loading, user, rental])
    
    if (rental.IMAGENES.length == 0) rental.IMAGENES.push("properties/example.jpg")

    return(
        <div className="rental-container">
        <div style={{display:'flex', width:'100%', flexDirection:'row', justifyContent:'flex-start'}}>
          <ImageCarousel images={rental.IMAGENES}/>
          <div className="main-info">
            <h1>{rental.TITULO}</h1>
            <div style={{display:'flex', gap:'10px', marginTop:'0.5rem', marginBottom:'0.5rem'}}>
              <div className="tag">{rental.TIPO_INMUEBLE}</div>
              <div className="tag">{rental.TIPO_ARRIENDO}</div>
            </div>
            <span className="main-info-price">{rental.PRECIO}</span>
            <div className="main-info-direction">
              <img className="icon" src="/images/icons/direction.svg"/>
              <span>{rental.DIRECCION}</span>
            </div>
            {(rental.SEDE_CERCANA != " - ") && (
              <span style={{color:"#00638e", fontWeight:'bold'}}>A {rental.DISTANCIA} de {rental.SEDE_CERCANA}</span>
            )}
            <div className="main-info-arrendador">
              <span>Arrendado por: </span>
              <p onClick={()=> router.push(`/profile/${rental.ID_ARRENDADOR}`)}>{rental.ARRENDADOR}</p>
            </div>
            {/* Botón de contacto */}
            <div style={{display:'flex', flexDirection:'row',marginTop:'0.5rem', height:"2.5rem", gap:'1rem', justifyContent:'space-between'}}>
            {user && user.ROL_USUARIO == "estudiante" && (
              <>
              <button className="btn-guardar" onClick={()=> {!guardado ? guardarArriendo(user?.ID_USUARIO) : eliminarGuardado(user?.ID_USUARIO) }}>
                <img src={guardado ? "/images/icons/bookmark-solid.svg" : "/images/icons/bookmark-regular.svg"} />
              </button>
              {!solicitud ? (
                <button className="btn-contactar" onClick={()=>solicitudContacto(user?.ID_USUARIO)}>Contactar</button>
              ):(
                <div style={{color:"#00638e", width:'70%' ,fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'center',
                border: '1pt solid #00638e', borderRadius:'1rem'}}>
                  <span>Solicitud de contacto esta {solicitud.ESTADO_SOLICITUD}</span>
                </div>
              )}
              </>
            )}
              <button onClick={()=> router.back()} className="btn-salir">Salir</button>
            </div>
          </div>
        </div>

        {(rental.TIPO_ARRIENDO == "por habitaciones") ?(
          <div style={{display:'flex', width:'100%', flexDirection:'row', justifyContent:'flex-start', gap:'1rem'}}>
            <div className="info-habitaciones">
              <h1>Habitaciones</h1>
              {rental.HABITACIONES?.map((hab, index)=>(
                <RoomCard habitacion={hab} key={index}/>
              ))}
            </div>
            <div className="descripcion-arriendo">
              <h1>Descripcion del arriendo</h1>
              <p>{rental.DESCRIPCION_ARRIENDO || "Sin descripción"}</p>
            </div>
          </div>
        ):(
          <div className="descripcion-arriendo">
            <h1>Descripcion del arriendo</h1>
            <p>{rental.DESCRIPCION_ARRIENDO || "Sin descripción"}</p>
          </div>
        )}

        <hr style={{width:'100%',marginBottom:'1rem'}}/>

        <h1 style={{fontSize:'1.25rem', color:'#00638e', fontWeight:'bold'}}>Sobre el inmueble</h1>
        <div className="info-inmueble">
          <div className="datos">
            <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
              <img className="icon" src="/images/icons/user.svg"/>
              <h4>Propietario</h4>
            </div>
            <p>{rental.PROPIETARIO || '-'}</p>
            <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
              <img className="icon" src="/images/icons/bed.svg"/>
              <h4>Habitaciones</h4>
            </div>
            <span>{rental.NUM_HABITACIONES}</span>
            <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
              <img className="icon" src="/images/icons/sink.svg"/>
              <h4>Baños</h4>
            </div>
            <span>{rental.NUM_BANIOS}</span>
          </div>
          <div className="descripcion">
            <h4>Descripción del inmueble</h4>
            <p>{rental.DESCRIPCION_INMUEBLE || 'Sin descripción'}</p>
          </div>
        </div>
      </div>
    );
}