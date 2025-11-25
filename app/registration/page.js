"use client";

import { useContext, useEffect } from "react";
import RegisterForm from "@/components/RegisterForm";
import Header from "@/components/Header";
import { AuthContext } from "@/contexts/AuthContext";
import '@/styles/register.css'

export default function RegisterPage() {
  const {isLogin, loading} = useContext(AuthContext);
  
  useEffect(() => {
    if (isLogin) {
      window.location.replace("/"); // o la ruta que quieras
    }
  }, [isLogin]);

  if (loading) return (<></>);

  if (!loading && !isLogin) return (
    <>
      <Header/>
      <RegisterForm />
    </>
  );
}
