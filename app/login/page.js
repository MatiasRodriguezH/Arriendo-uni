"use client";

import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";
import '@/styles/home.css';

export default function LoginPage() {
  return (
    <>
      <Header/>
      <div className="register-container">
        <Loginform />
      </div>  
    </>
  );
}