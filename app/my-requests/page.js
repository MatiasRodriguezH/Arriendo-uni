"use client";

import Header from "@/components/Header";
import MyRequestsList from "@/app/my-requests/MyRequestsList";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function ResquestPage() {
    const { user, isLogin, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isLogin) {
            router.push("/login");
        }
        if (!loading && user.ROL_USUARIO != 'estudiante') {
            router.push("/");
        }
    },[loading]);
    
    if (!loading && user) return (
        <>
            <Header />
            <MyRequestsList idUser={user.ID_USUARIO}/>
        </>
    )
}