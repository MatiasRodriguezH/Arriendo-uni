"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import "@/styles/myelements.css"
import Header from "@/components/Header";
import SavedRentals from "@/components/SavedRentals";

export default function SavedRentalsPage() {
    const {user, isLogin, loading} = useContext(AuthContext);
    const router = useRouter();
    const [guardados, setGuardados] = useState([]);

    useEffect(()=>{
        async function fetchGuardados() {
            const result = await fetch(`/api/user/interactions?u=${user.ID_USUARIO}`);
            const data = await result.json();
            setGuardados(data);
        }
        if (!loading){
            if (!isLogin) router.push('/login');
            if (user){
                if (user.ROL_USUARIO != "estudiante") router.push('/');
                fetchGuardados();
            }
        }
    },[loading, user, isLogin]);

    return(
        <>
            <Header/>
            <SavedRentals arriendos={guardados}/>
        </>
    );
}