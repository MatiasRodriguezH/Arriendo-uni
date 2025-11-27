
function Direccion({direccion, setDireccion, regiones}){
    return(
      <>
      <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
        <div style={{display:'flex', flexDirection:'column', width:'70%'}}>
          <h4>Calle <span style={{ color: "red" }}>*</span></h4>
          <input value={direccion.calle} style={{width:'100%'}} onChange={(e) => setDireccion({...direccion, calle: e.target.value})}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', width:'28%'}}>
          <h4>Numero </h4>
          <input value={direccion.numero} style={{width:'100%'}} onChange={(e) => setDireccion({...direccion, numero: e.target.value})}/>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
        <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
          <h4>Ciudad <span style={{ color: "red" }}>*</span></h4>
          <input value={direccion.ciudad} style={{width:'100%'}} onChange={(e) => setDireccion({...direccion, ciudad: e.target.value})}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
          <h4>Región <span style={{ color: "red" }}>*</span></h4>
          <select style={{width: "100%", height:'100%'}} value={direccion.region} onChange={(e) => setDireccion({...direccion,region: e.target.value})}>
            <option value="" disabled>Selecciona Región</option>
            {regiones.map(reg => (<option key={reg.ID_REGION} value={reg.ID_REGION }>{reg.NOMBRE}</option>))}
          </select>
        </div>
      </div>
      <h4>Dirección adicional</h4>
      <input value={direccion.adicional || ""} style={{width:'100%', marginBottom:'1%'}} onChange={(e) => setDireccion({...direccion, adicional: e.target.value})}/>
      </>
    )
}
export default Direccion