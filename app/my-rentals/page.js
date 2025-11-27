"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import "@/styles/myrentals.css"

export default function MyRentalsPage() {
    const {user, isLogin, loading} = useContext(AuthContext);
    const router = useRouter();
    const [arriendos, setArriendos] = useState([]);

    useEffect(()=>{
        async function fetchArriendos() {
            const result = await fetch(`/api/user/rentals?id=2`);
            const data = await result.json();
            setArriendos(data);
        }
        fetchArriendos();
    },[]);

    const goToArriendo = (id) => {
    router.push(`/my-rentals/edit?id=${id}`);
    };


return (
    <div className="rentals-wrapper">
        <h2 className="title">Mis Arriendos</h2>


        <div className="rentals-grid">
        {arriendos.map((item) => (
            <div
                key={item.ID_ARRIENDO}
                className="rental-card"
                onClick={() => goToArriendo(item.ID_ARRIENDO)}
            >
                <img
                    src={item.IMAGEN_PORTADA ? `/images/${item.IMAGEN_PORTADA}` : "/images/example.jpg"}
                    alt="preview"
                    className="rental-img"
                />
                <div className="rental-info">
                    <h3 className="rental-name">{item.TITULO}</h3>
                </div>
            </div>
        ))}
        </div>
    </div>
    );
}