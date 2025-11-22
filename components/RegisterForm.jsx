"use client";

import { useState } from "react";
import "@/styles/register.css";
import "../styles/nuevo_arriendo.css"
import { useRut } from 'react-rut-formatter';

export default function RegisterForm(){
    const[email, setEmail] = useState("")
    const[username, setUsername] = useState("")
    const[password, setPassword] = useState("")
    const[repeatPassword, setRepeatPassword] = useState("")
    const[nombre, setNombre] = useState("")
    const[apellido, setApellido] = useState("")
    const[segundoApellido, setSegundoApellido] = useState("")
    const[rutValue, setRutValue] = useState("");
    const{rut, isValid, updateRut} = useRut(rutValue);
    const[telefono, setTelefono] = useState("")
    const[sedeInstitucional, setSedeInstitucional] = useState("")
    const[ciudad, setCiudad] = useState("")
    const[fechaNacimiento, setFechaNacimiento] = useState("")
    const[error, setError] = useState("")

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
            const response = await fetch("http://localhost:3000/api/login", { 
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
        <div className="content">
            <h2>
                Crear cuenta
            </h2>
            <br />
            <form onSubmit={handleRegister}>
                <label >Email: </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            <br />
                <label>Usuario: </label>
                <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            <br />
                <label>Nombre: </label>
                <input 
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
            <br />
                <label>Primer apellido </label>
                <input 
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                />
            <br />
                <label>Segundo apellido </label>
                <input 
                    type="text"
                    value={segundoApellido}
                    onChange={(e) => setSegundoApellido(e.target.value)}
                />
            <br />
                <label>RUT: </label>
                <input 
                    type="text"
                    value={rut.formatted}
                    onChange={(e)=>{setRutValue(e.target.value);
                        updateRut(e.target.value)}}
                />
            <br />
                <label>Teléfono: </label>
                <input 
                    type="text"
                    value={telefono}
                    onChange={(e)=>setTelefono(e.target.value)}
                />
            <br />
                <label>Sede Institucional: </label>
                <div>
                    {["Universidad Catolica del Maule", "Universidad de Talca", "Universidad Santo Tomas"].map((s, index) => (
                        <div key={index}>
                            <input
                                type="radio"
                                name="sede"
                                value={s}
                                checked={sedeInstitucional === s}
                                onChange={() => setSedeInstitucional(s)}
                            />
                            <label>{s}</label>
                        </div>
                    ))}
                </div>
            <br />
                <label>Ciudad: </label>
                <input 
                    type="text"
                    value={ciudad}
                    onChange={(e)=> setCiudad(e.target.value)}
                />

            <br />
                <label>Fecha de nacimiento: </label>
                <input 
                type="date"
                value={fechaNacimiento}
                onChange={(e)=> setFechaNacimiento(e.target.value)}
                />
            <br /> 
                <label>Contraseña: </label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            <br />
                <label>Repetir Contraseña:</label>
                <input 
                    type="password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <button type="submit" className="boton">Enviar</button>
            </form>
        </div>
    );
}

