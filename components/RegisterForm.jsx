"use client";

import { useState } from "react";
import "../styles/register.css";

export default function registerform(){
    const[email, setEmail] = useState("")
    const[username, setUsername] = useState("")
    const[password, setPassword] = useState("")
    const[repeatPassword, setRepeatPassword] = useState("")
    const[error, setError] = useState("")

    if (!email || !username || !password || !repeatPassword){
        setError("Complete todos los campos")
    }

    if (password !== repeatPassword){
        setError("La contraseña no coincide")
    }

    return(
        <div>
            <h2>
                Crear cuenta
            </h2>

            <form onSubmit={handleRegister}>
                <label>Email</label>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Nombre de usuario</label>
                <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label>Contraseña</label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label>Repetir Contraseña</label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />

            </form>
        </div>
    )
}

