"use client";

import { useState, useEffect, useContext } from "react";
import styles from "@/styles/dashboard/registerform.module.css";
import { useRut } from 'react-rut-formatter';
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterAdmin(){
    const {cargarUsuario} = useContext(AuthContext);
    const[loading, setLoading] = useState(false);
    const router = useRouter();

    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[repeatPassword, setRepeatPassword] = useState("")
    const[nombre, setNombre] = useState("")
    const[apellido, setApellido] = useState("")
    const[segundoApellido, setSegundoApellido] = useState("")
    const[rutValue, setRutValue] = useState("");
    const{rut, isValid, updateRut} = useRut(rutValue);
    const[fechaNacimiento, setFechaNacimiento] = useState("");
    const[error, setError] = useState("");
    

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
        if (!email || !password || !nombre || !apellido || !rut || !fechaNacimiento){
            setError("Los campos obligatorios no deben quedar vacíos");
            return null;
        }
        if (!verificarEmail(email)){ 
            setError("Correo ingresado no valido"); 
            return null;
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
                    rol: "admin",
                    correo: email,
                    contrasenia: password,
                    nombre: nombre,
                    apellido1: apellido,
                    apellido2: segundoApellido,
                    rut: rut.raw,
                    telefono: "",
                    sede_institucion: "",
                    ciudad: "",
                    id_region: "",
                    fecha_nacimiento: fechaNacimiento,
                    genero: ""
                })
            }); 

            const data = await response.json();

            if (!response.ok) {
                if (response.status == 410){
                    setError("Correo o Rut ya estan usados");
                    setLoading(false);
                    return null;
                }
                setError("Error al registrarse");
                setLoading(false);
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
        <div style={{width:'40vw'}} className={styles["content"]}>
            <h2 style={{justifySelf:'center'}}>
                Crear cuenta  de administrador
            </h2>
            <br />
            <form onSubmit={handleRegister}>
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
                        <h4>Fecha de nacimiento <span style={{ color: "red" }}>*</span></h4>
                        <input 
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e)=> setFechaNacimiento(e.target.value)}
                        />
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
                <div style={{display:'flex', gap:'1rem', marginTop:'2rem'}}>
                    <button style={{width:'10rem',opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer"}} 
                        type="submit">
                        {!loading ? "Registrarse":"Registrando..."}
                    </button>
                </div>
            </form>
        </div>
    );
}

