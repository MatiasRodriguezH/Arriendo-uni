"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import UpdateForm from "@/components/UpdateProfileForm";
import Header from "@/components/Header";

export default function EditProfile() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(()=>{
    if (!loading && !user){
      router.push('/login');
    }
  },[loading]);

  if (!loading) return (
    <>
    <Header/>
    <UpdateForm user={user} />
    </>
  );
}
