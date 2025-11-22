"use client";

import { useState, useEffect } from "react";
import "@/styles/register.css";
import { useRut } from 'react-rut-formatter';

export default function RegisterForm(){
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
    const[genero, setGenero] = useState("");
    const[fechaNacimiento, setFechaNacimiento] = useState("");
    const[error, setError] = useState("");
    
    const[instituciones, setInstituciones] = useState([]);
    const[sedes, setSedes] = useState([]);

    useEffect(() => {
        async function fetchInstituciones() {
          const result = await fetch("http://localhost:3000/api/data/institutions")
          const data = await result.json();
          setInstituciones(data);
        }
        fetchInstituciones();
    }, []);

    async function fetchSedes(id) {
          const result = await fetch(`http://localhost:3000/api/data/hq-institutions?id=${id}`);
          const data = await result.json();
          setSedes(data);
    }

    async function handleRegister(e) {
        e.preventDefault(); 
        
        setError("");

        if (!email || !username || !password || !repeatPassword || !nombre || !apellido || !segundoApellido ||!rut || !telefono || !ciudad || !sedeInstitucional){
            setError("Complete todos los campos");
            return;
        }

        if (password !== repeatPassword){
            setError("La contraseña no coincide");
            return;
        }

        if (!isValid) {
            setError("RUT inválido");
            return;
        }

        console.log("Registrando usuario...");
        try {
            const response = await fetch("http://localhost:3000/api/register", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password,
                    nombre: nombre,
                    apellido: apellido,
                    segundoApellido: segundoApellido,
                    rut: rut.raw,
                    telefono: telefono,
                    sedeInstitucional: sedeInstitucional,
                    ciudad: ciudad,
                    fechaNacimiento: fechaNacimiento
                })
            }); 

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Error en el registro");
                return;
            }

            console.log("Usuario registrado:", data);

        } catch (err) {
            console.error("Error en el registro:", err);
            setError("Error de conexión");
        }
    };

    return(
        <div className="register-container">
            <h2>
                Crear cuenta
            </h2>
            <br />
            <form onSubmit={handleRegister}>
                <h4>Eres...</h4>
                <select style={{width:'100%', height:'37px', marginBottom:'4%'}} 
                    value={rol} 
                    onChange={(e) => setRol(e.target.value)}
                >
                    <option value="estudiante" >Estudiante</option>
                    <option value="arrendador" >Arrendador / Propietario</option>
                </select>
                <br />
                <h4 >Email</h4>
                <input
                    style={{width:'100%'}} 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <h4 >Nombre</h4>
                <input
                    style={{width:'100%'}} 
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <br />
                <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Primer apellido </h4>
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
                        <h4>RUT</h4>
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
                    <h4>Institucion</h4>
                    <select style={{width:'100%',height:'37px'}} 
                        value={institucion} 
                        onChange={(e) => {SetInstitucion(e.target.value);
                                        setSedeInstitucional("");
                                        fetchSedes(e.target.value);
                        }}
                    >
                        <option value="" disabled>Seleciona institución...</option>
                        {instituciones.map((s, index) => (
                            <option value={s.ID_INSTITUCION}>
                                {s.NOMBRE}
                            </option>
                        ))}
                    </select>
                    {(institucion != '') &&(
                        <>
                        <h4>Sede</h4>
                        <select style={{width:'100%',height:'37px'}} 
                            value={sedeInstitucional} 
                            onChange={(e) => setSedeInstitucional(e.target.value)}>
                            <option value="" disabled>Seleciona sede...</option>
                            {sedes.map((s, index) => (
                                <option value={s.ID_SEDE}>
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
                    <h4>Ciudad de residencia</h4>
                    <input 
                        type="text"
                        value={ciudad}
                        onChange={(e)=> setCiudad(e.target.value)}
                    />
                    <br/>
                    </>
                )}

                <br />
                <div style={{display:'flex', flexDirection:'row', gap:'2%'}}>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Fecha de nacimiento</h4>
                        <input 
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e)=> setFechaNacimiento(e.target.value)}
                        />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Género</h4>
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
                        <h4>Contraseña: </h4>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', width:'49%'}}>
                        <h4>Repetir Contraseña:</h4>
                        <input 
                            type="password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                    </div>
                </div>
                <button type="submit" className="boton">Enviar</button>
            </form>
        </div>
    );
}

