"use client";

import { useState, useEffect, useContext } from "react";
import "@/styles/form.css";
import { useRut } from 'react-rut-formatter';
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterForm(){
    const {cargarUsuario} = useContext(AuthContext);
    const[loading, setLoading] = useState(false);
    const router = useRouter();

    const[rol,setRol] = useState("estudiante");
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[repeatPassword, setRepeatPassword] = useState("")
    const[nombre, setNombre] = useState("")
    const[apellido, setApellido] = useState("")
    const[segundoApellido, setSegundoApellido] = useState("")
    const[rutValue, setRutValue] = useState("");
    const{rut, isValid, updateRut} = useRut(rutValue);
    const[telefono, setTelefono] = useState("");
    const[institucion,SetInstitucion] = useState("");
    const[sedeInstitucional, setSedeInstitucional] = useState("");
    const[ciudad, setCiudad] = useState("");
    const[idRegion,setIdRegion] = useState("");
    const[genero, setGenero] = useState("");
    const[fechaNacimiento, setFechaNacimiento] = useState("");
    const[error, setError] = useState("");
    
    const[regiones,setRegiones] = useState([]);
    const[instituciones, setInstituciones] = useState([]);
    const[sedes, setSedes] = useState([]);

    useEffect(() => {
        async function fetchRegiones() {
            const result = await fetch("http://localhost:3000/api/data/regions");
            const data = await result.json();
            setRegiones(data);
        }
        async function fetchInstituciones() {
          const result = await fetch("http://localhost:3000/api/data/institutions")
          const data = await result.json();
          setInstituciones(data);
        }
        fetchRegiones();
        fetchInstituciones();
    }, []);

    async function fetchSedes(id) {
          const result = await fetch(`http://localhost:3000/api/data/hq-institutions?id=${id}`);
          const data = await result.json();
          setSedes(data);
    }

    function calcularEdad(dateString) {
        const fechaNacimiento = new Date(dateString);
        const fechaActual = new Date();

        const diferenciaMs = fechaActual - fechaNacimiento;

        // Fórmula para convertir milisegundos a años
        const msEnUnAnio = 1000 * 60 * 60 * 24 * 365.25;
        const edadExacta = diferenciaMs / msEnUnAnio;
        const edad = Math.floor(edadExacta);
        return edad;
    }
    function verificarEmail(email) {
        // Expresión Regular para un formato de email estándar
        const regexEmail = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

        // El método test() de la expresión regular devuelve true o false
        return regexEmail.test(email);
    }

    async function handleRegister(e) {
        e.preventDefault(); 
        
        setError("");
        //verificar datos
        if (!email || !password || !nombre || !apellido || !rut || !genero || !fechaNacimiento){
            setError("Los campos obligatorios no deben quedar vacíos");
            return null;
        }
        if (!verificarEmail(email)){ 
            setError("Correo ingresado no valido"); 
            return null;
        }
        if (rol == "estudiante"){
            if (!institucion || !sedeInstitucional){
                setError("Los campos obligatorios no deben quedar vacíos");
                return null;
            }
        }
        if (rol == "arrendador"){
            if (idRegion && !ciudad || ciudad && !idRegion){
                setError("Ingresa una ciudad y region de residencia");
                return null;
            }
        }

        if (calcularEdad(fechaNacimiento) < 17){
            setError("Debes ser mayor de 17 años");
            return null;
        }
        if (password !== repeatPassword){
            setError("La contraseña no coincide");
            return null;
        }
        if (!isValid) {
            setError("RUT inválido");
            return null;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/registration", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rol: rol,
                    correo: email,
                    contrasenia: password,
                    nombre: nombre,
                    apellido1: apellido,
                    apellido2: segundoApellido,
                    rut: rut.raw,
                    telefono: telefono,
                    sede_institucion: sedeInstitucional,
                    ciudad: ciudad,
                    id_region: idRegion,
                    fecha_nacimiento: fechaNacimiento,
                    genero: genero
                })
            }); 

            const data = await response.json();

            if (!response.ok) {
                if (response.status == 410){
                    setError("Correo o Rut ya estan usados");
                    return null;
                }
                setError("Error al registrarse");
                return null;
            }
            
            localStorage.setItem("token",data.token);
            await cargarUsuario();
            setError("");
            setLoading(false);
            window.location.replace("http://localhost:3000");

        } catch (err) {
            setLoading(false);
            console.error("Error en el registro:", err);
            setError("Error de conexión");
        }
    };

    return(
        <div className="content">
            <h2>
                Crear cuenta
            </h2>
            <br />
            <form onSubmit={handleRegister}>
                <h4>Eres...</h4>
                <select style={{width:'100%', height:'37px', marginBottom:'4%'}} 
                    value={rol} 
                    onChange={(e) => {setRol(e.target.value); SetInstitucion(""); setIdRegion(""); setCiudad("");}}
                >
                    <option value="estudiante" >Estudiante</option>
                    <option value="arrendador" >Arrendador / Propietario</option>
                </select>
                <br />
                <h4 >Email <span style={{ color: "red" }}>*</span></h4>
                <input
                    style={{width:'100%'}} 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <h4 >Nombre <span style={{ color: "red" }}>*</span></h4>
                <input
                    style={{width:'100%'}} 
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <br />
                <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Primer apellido <span style={{ color: "red" }}>*</span></h4>
                        <input 
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                        />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                    <h4>Segundo apellido </h4>
                    <input 
                        type="text"
                        value={segundoApellido}
                        onChange={(e) => setSegundoApellido(e.target.value)}
                    />
                    </div>
                </div>
                <br />
                <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>RUT <span style={{ color: "red" }}>*</span></h4>
                        <input 
                            type="text"
                            value={rut.formatted}
                            onChange={(e)=>{setRutValue(e.target.value);
                                updateRut(e.target.value)}}
                        />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Teléfono</h4>
                        <input 
                            type="text"
                            value={telefono}
                            onChange={(e)=>setTelefono(e.target.value)}
                        />
                    </div>
                </div>
                <br />
                {(rol == "estudiante") ?(
                    <>
                    <h4>Institucion en la que estudias <span style={{ color: "red" }}>*</span></h4>
                    <select style={{width:'100%',height:'37px'}} 
                        value={institucion} 
                        onChange={(e) => {SetInstitucion(e.target.value);
                                        setSedeInstitucional("");
                                        fetchSedes(e.target.value);
                        }}
                    >
                        <option value="" disabled>Seleciona institución...</option>
                        {instituciones.map((s, index) => (
                            <option key={s.ID_INSTITUCION} value={s.ID_INSTITUCION}>
                                {s.NOMBRE}
                            </option>
                        ))}
                    </select>
                    {(institucion != '') &&(
                        <>
                        <h4>Sede en la que estudias <span style={{ color: "red" }}>*</span></h4>
                        <select style={{width:'100%',height:'37px'}} 
                            value={sedeInstitucional} 
                            onChange={(e) => setSedeInstitucional(e.target.value)}>
                            <option value="" disabled>Seleciona sede...</option>
                            {sedes.map((s, index) => (
                                // Cambie la key, antes era {s.ID_INSTITUCION}
                                <option key={index} value={s.ID_SEDE}>  
                                    {s.NOMBRE}
                                </option>
                            ))}
                        </select>
                        </>
                    )}
                    <br />
                    </>
                ):(
                    <>
                    <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
                        <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Ciudad de residencia</h4>
                        <input 
                            type="text"
                            value={ciudad}
                            onChange={(e)=> setCiudad(e.target.value)}
                        />
                        </div>
                        <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Región de residencia</h4>
                        <select style={{width: "100%", height:'100%'}} value={idRegion} onChange={(e) => setIdRegion(e.target.value)}>
                            <option value="" disabled>Selecciona Región</option>
                            {regiones.map(reg => (<option key={reg.ID_REGION} value={reg.ID_REGION }>{reg.NOMBRE}</option>))}
                        </select>
                        </div>
                    </div>
                    <br/>
                    </>
                )}
                <br />
                <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Fecha de nacimiento <span style={{ color: "red" }}>*</span></h4>
                        <input 
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e)=> setFechaNacimiento(e.target.value)}
                        />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Género <span style={{ color: "red" }}>*</span></h4>
                        <select style={{height:'100%'}}
                        value={genero}
                        onChange={(e)=> setGenero(e.target.value)}
                        >
                            <option value="" disabled>Selecciona género...</option>
                            <option value="femenino">Femenino</option>
                            <option value="masculino">Masculino</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                </div>
                <br /> 
                <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Contraseña <span style={{ color: "red" }}>*</span></h4>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Repetir contraseña</h4>
                        <input 
                            type="password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div style={{margin:'3% 0% 0% 0%'}}>
                    <span style={{color:'red'}}>{error}</span>
                </div>
                <div style={{display:'flex', gap:'1rem', marginTop:'1rem'}}>
                    <button style={{opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer"}} 
                        type="submit">
                        {!loading ? "Registrarse":"Registrando..."}
                    </button>
                    <button type="button" onClick={()=> router.back()}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

