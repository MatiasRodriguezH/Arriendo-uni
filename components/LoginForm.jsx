"use client";

import { useState, useContext, useEffect } from "react";
import "@/styles/login.css";
import Link from "next/link";
import { AuthContext } from "@/contexts/AuthContext";

export default function LoginForm(){
    const { cargarUsuario } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleRegister(e) {
        e.preventDefault(); 

        if (email =='' || password ==''){
            setError("Correo o constraseña incorrecta")
            return null;
        }

        const form = {
            email : email,
            password : password
        }
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/login",
            {   method:"POST",
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(form)
            });
        if (res.ok){
            const data = await res.json();
            localStorage.setItem("token",data.token);
            await cargarUsuario();
            setError("");
            setLoading(false);
            window.location.replace("http://localhost:3000")
        }
        else if (res.status == 410){
            setError("Correo no valido");
            setLoading(false);
        }
        else if (res.status == 411){
            setError("Contraseña incorrecta");
            setLoading(false);
        }
    }

    return(
        <div className="login-container">
            <h2 style={{justifySelf:'center'}}>
                Ingresar
            </h2>
            <br />
            <form onSubmit={handleRegister}>
                <h4 >Email </h4>
                <input style={{width:'100%', marginBottom:'1%'}} onChange={(e)=>setEmail(e.target.value)} spellCheck="false"/>
                <br/>
                <h4>Contraseña </h4>
                <input type='password' style={{width:'100%'}} onChange={(e)=>setPassword(e.target.value)}/>
                <br/>
                <div style={{justifySelf:'center', margin: '1% 0% -2% 0%'}}>
                    <span style={{color:'red', fontSize:'1vw'}}>{error}</span>
                </div>
                <div style={{justifySelf:'center', margin: '10% 0% -2% 0%'}}>
                    <a href="registration">¿Estas registrado?</a>
                </div>
                <button style={{opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer"}}
                type="submit" className="boton">
                    {!loading ? "Ingresar":"Ingresando..."}
                </button>
            </form>
        </div>
    );
}


