"use client";

import { useState } from "react";
import "@/styles/register.css";
import "../styles/nuevo_arriendo.css"

export default function RegisterForm(){
    const[email, setEmail] = useState("")
    const[username, setUsername] = useState("")
    const[password, setPassword] = useState("")
    const[repeatPassword, setRepeatPassword] = useState("")
    const[error, setError] = useState("")

    async function handleRegister(e) {
        if (!email || !username || !password || !repeatPassword){
            setError("Complete todos los campos")
        }

        if (password !== repeatPassword){
            setError("La contraseña no coincide")
        }
        const handleRegister = (e) => {
            e.preventDefault();}

        console.log("Registrando usuario...");
        // aquí haces el fetch o lo que quieras

        setError("");
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

