"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import "@/styles/myrentals.css";

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
    <div className="rentals-wrapper">
        <h2 className="title">Mis inmuebles</h2>


        <div className="rentals-grid">
        {inmuebles.map((item) => (
            <div
                key={item.ID_INMUEBLE}
                className="rental-card"
                onClick={() => goToInmueble(item.ID_INMUEBLE)}
            >
                <img
                    src={item.IMAGEN_PORTADA ? `/images/${item.IMAGEN_PORTADA}` : "/images/example.jpg"}
                    alt="preview"
                    className="rental-img"
                />
                <div className="rental-info">
                    <h3 className="rental-name">{item.NOMBRE}</h3>
                </div>
            </div>
        ))}
        </div>
    </div>
    );
}