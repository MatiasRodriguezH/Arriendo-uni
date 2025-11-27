"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import "@/styles/myelements.css"
import Header from "@/components/Header";

export default function MyRentalsPage() {
    const {user, isLogin, loading} = useContext(AuthContext);
    const router = useRouter();
    const [arriendos, setArriendos] = useState([]);

    useEffect(()=>{
        async function fetchArriendos() {
            const result = await fetch(`/api/user/rentals?id=${user.ID_USUARIO}`);
            const data = await result.json();
            setArriendos(data);
        }
        if (!loading){
            if (!isLogin) router.push('/login');
            if (user){
                if (user.ROL_USUARIO != "arrendador") router.push('/');
                fetchArriendos();
            }
        }
    },[loading]);

    const goToArriendo = (id) => {
    router.push(`/my-rentals/edit?id=${id}`);
    };


return (
    <>
    <Header/>
    <div className="items-wrapper">
        <span className="title">Mis Arriendos</span>

        <div className="items-grid">
        {arriendos.map((item) => (
            <div
                key={item.ID_ARRIENDO}
                className="item-card"
                onClick={() => goToArriendo(item.ID_ARRIENDO)}
            >
                <img
                    src={item.IMAGEN_PORTADA ? `/images/${item.IMAGEN_PORTADA}` : "/images/example.jpg"}
                    alt="preview"
                    className="item-img"
                />
                <div className="item-info">
                    <div style={{display:'flex', gap:'5px'}}>
                        <div className="item-tag"> {item.TIPO_INMUEBLE} </div>
                        <div className="item-tag"> {item.TIPO_ARRIENDO} </div>
                    </div>
                    <h3 className="item-name">{item.TITULO}</h3>
                    <h3 className="item-subname">{item.NOMBRE}</h3>
                </div>
            </div>
        ))}
        </div>
    </div>
    </>
    );
}