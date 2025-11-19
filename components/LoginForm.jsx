"use client";

import { useState } from "react";
import "@/styles/register.css";
import "../styles/nuevo_arriendo.css"

export default function LoginForm(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        console.log("Datos enviados:");
        console.log({ email, password });
    };

    //fetch

    return(
        <div className="content">
            <h2>
                Ingresar a la cuenta
            </h2>
            <br />
            <form>
                <label >Email: </label>
                <input />
            <br />
                <label>Contraseña: </label>
                <input />
            <br />
                <button type="submit" className="boton">Ingresar</button>
            </form>
        </div>
    );
}


