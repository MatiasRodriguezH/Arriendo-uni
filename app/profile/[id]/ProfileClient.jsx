"use client";

import Header from "@/components/Header";
import ProfileView from "@/components/ProfileView";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";

export default function ProfileClient({ id }) {
    const {isLogin, loading, user} = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUsuario(id){
            const result = await fetch(`/api/profile?id=${id}`);
            const data = await result.json()
            setProfile(data);
        }

        if(!loading){
            if (!isLogin) router.push('/login');
            if (user.ID_USUARIO == id) router.push('/my-profile');
            fetchUsuario(id);
        }
    }, [id, loading, isLogin]);

    if (!loading && isLogin) return (
       <>
        <Header/>
        <ProfileView user={profile} type="other"/>
       </>
    );
}
