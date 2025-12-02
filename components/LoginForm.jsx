"use client";

import { useState, useContext, useEffect } from "react";
import "@/styles/form.css";
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
        try{
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
            else if (res.status == 400){
                setError("Error al iniciar sesión");
                setLoading(false);
            }
        }
        catch(error){
            setError("Error al iniciar sesión");
            setLoading(false);
        }
    }

    return(
        <div style={{width:'25vw'}} className="content">
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
                <div style={{display: 'flex', width:'100%', marginTop:'1rem'}}>
                <button style={{width:'100%', opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer"}}
                type="submit">
                    {!loading ? "Ingresar":"Ingresando..."}
                </button>
                </div>
            </form>
        </div>
    );
}


