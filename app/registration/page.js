"use client";

import RegisterForm from "@/components/RegisterForm";
import Header from "@/components/Header";
import '@/styles/home.css'

export default function RegisterPage() {
  return (
    <>
      <Header/>
      <div className="register-container">
        <RegisterForm />
      </div>
    </>
  );
}
