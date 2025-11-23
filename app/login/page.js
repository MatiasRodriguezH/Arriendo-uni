"use client";

import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";
import '@/styles/home.css';
import { useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function LoginPage() {
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
      <LoginForm />
    </>
  );
}