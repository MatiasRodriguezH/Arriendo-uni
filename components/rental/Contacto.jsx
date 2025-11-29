import { useState } from "react";

function Contacto({contacto, setContacto}){
    const [nuevoContacto, setNuevoContacto] = useState(false);

    return(
      <div style={{marginBottom:'1%'}}>
      <h4>Usar medios de contacto</h4>
      <select
        style={{width: "50%"}}
        value={contacto.origen_contacto}
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

export default Contacto