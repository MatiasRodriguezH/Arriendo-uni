"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import "@/styles/myelements.css";
import Header from "@/components/Header";

export default function MyPropertiesPage() {
    const {user, isLogin, loading} = useContext(AuthContext);
    const router = useRouter();
    const [inmuebles, setinmuebles] = useState([]);

    useEffect(()=>{
        async function fetchInmuebles() {
            const result = await fetch(`/api/user/properties?id=2`);
            const data = await result.json();
            setinmuebles(data);
        }
        fetchInmuebles();
    },[]);

    const goToInmueble = (id) => {
    router.push(`/my-properties/edit?id=${id}`);
    };


return (
    <>
    <Header/>
    <div className="items-wrapper">
        <span className="title">Mis Inmuebles</span>


        <div className="items-grid">
        {inmuebles.map((item) => (
            <div
                key={item.ID_INMUEBLE}
                className="item-card"
                onClick={() => goToInmueble(item.ID_INMUEBLE)}
            >
                <img
                    src={item.IMAGEN_PORTADA ? `/images/${item.IMAGEN_PORTADA}` : "/images/example.jpg"}
                    alt="preview"
                    className="item-img"
                />
                <div className="item-info">
                    <div style={{display:'flex', gap:'5px'}}>
                        <div className="item-tag"> {item.TIPO_INMUEBLE} </div>
                        <div className="item-tag"> {item.ESTADO} </div>
                    </div>
                    <h3 className="item-name">{item.NOMBRE}</h3>
                    <h3 className="item-subname">{item.DIRECCION}</h3>
                </div>
            </div>
        ))}
        {inmuebles.length == 0 && <span style={{marginLeft:'auto', fontSize:'1.5rem',color:'gray', margin:'1rem'}}>
            No existen inmuebles</span>}
        </div>
    </div>
    </>
    );
}