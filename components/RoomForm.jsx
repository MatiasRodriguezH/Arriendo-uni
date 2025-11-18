"use client";

import '@/styles/nuevo_arriendo.css'
import ImageUploader from './ImageUploader'

export default function RoomForm({hab,index, actualizarHabitacion, eliminarHabitacion}){

    const onImageChange = useCallback((files) => {
    actualizarHabitacion(index, "imagen_portada", files[0]);
    }, [index, actualizarHabitacion]);

    return (
        <div
        key={index}
        style={{ width:'60%',border: "1px solid #ccc", padding: "15px", marginBottom: "15px",borderRadius: "1vw", background: "#f7f7f7"}}
        >
            <h3>Habitación {index + 1}</h3>

            <h4>Nombre habitación</h4>
            <input
                style={{width:'100%'}}
                placeholder={"Habitacion "+(index+1)}
                value={hab.nombre}
                onChange={(e) => actualizarHabitacion(index, "nombre", e.target.value)}
            />
            <h4>Descripcion habitación</h4>
            <textarea
                className='descripcion'
                style={{width:'100%'}}
                placeholder="Descripción de la habitacion..."
                value={hab.descripcion}
                onChange={(e) =>
                actualizarHabitacion(index, "descripcion", e.target.value)
                }
            />
        
            <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
                <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                    <h4>Tamaño</h4>
                    <input
                        type="number"
                        min="0"
                        placeholder="Tamaño (m²)"
                        value={hab.tamano}
                        onChange={(e) => actualizarHabitacion(index, "tamano", e.target.value)}
                    />
                </div>
                <div style={{display:'flex', flexDirection:'column', width:'49%', marginBottom:'1%'}}>
                    <h4>Precio</h4>
                    <input
                        type="number"
                        min="0"
                        placeholder="Precio"
                        value={hab.precio}
                        onChange={(e) => actualizarHabitacion(index, "precio", e.target.value)}
                    />
                </div>
            </div>

            <h4>Imagen portada</h4>
            <ImageUploader imageOnChanges={onImageChange}/>
            
            

            <button
                type="button"
                style={{
                fontSize:'1vw',
                marginTop: "10px",
                background: "red",
                color: "white",
                padding: "6px 10px",
                border: "none",
                borderRadius: "0.75vw",
                cursor: "pointer"
                }}
                onClick={() => eliminarHabitacion(index)}
            >
                Eliminar
            </button>
        </div>
    )
}
