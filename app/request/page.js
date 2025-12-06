"use client";

import Header from "@/components/Header";
import MyRequestsList from "@/app/my-requests/MyRequestsList";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter, useSearchParams  } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import RequestView from "@/components/RequestView";

export default function ResquestPage({ searchParams}) {
    const params = useSearchParams();
    const usuario = params.get("u");
    const arriendo = params.get("r");

    const { user, isLogin, loading } = useContext(AuthContext);
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (!loading && !isLogin) {
            router.push("/login");
        }
        async function validarAcceso() {
            if (String(user.ID_USUARIO) == String(usuario)) {
            setAllowed(true);
            return;
            }
            const res = await fetch(`/api/validate-rental?r=${arriendo}&u=${user.ID_USUARIO}`);
            const data = await res.json();
            if (data.permitido) {
                setAllowed(true);
            } else {
                router.push("/");
            }
        };

        if(!loading && user){
            validarAcceso(); 
        }
    },[loading]);
    if (allowed) return(
        <>
        <Header />
        <RequestView usuarioId={usuario} arriendoId={arriendo} rol={user.ROL_USUARIO}/>
        </>
    );
}