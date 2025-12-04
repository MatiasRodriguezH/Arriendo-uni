"use client";

import ProfileView from "@/components/ProfileView";
import { AuthContext } from "@/contexts/AuthContext";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function MyProfilePage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(()=>{
    if(!loading && !user){
      router.push('/login');
    }
  });
  return (
    <>
      <Header/>
      <ProfileView user={user} type="me"/>
    </>
  );
}


