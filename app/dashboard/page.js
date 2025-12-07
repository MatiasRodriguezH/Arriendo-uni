"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/dashboard.css";
import InstitutionsPanel from "@/components/dashboard/InstitutionsPanel";
import HqsPanel from "@/components/dashboard/HqsPanel";
import CitiesPanel from "@/components/dashboard/CitiesPanel";
import Report1Panel from "@/components/dashboard/Report1Panel";
import Report2Panel from "@/components/dashboard/Report2Panel";
import Report3Panel from "@/components/dashboard/Report3Panel";
import AdminUsersList from "@/components/dashboard/AdminUserList";
import RegisterAdmin from "@/components/dashboard/RegisterAdmin";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function Dashboard() {
  const [section, setSection] = useState("inicio");
  const {user, isLogin, loading} = useContext(AuthContext);
  const router = useRouter();

  useEffect(()=>{
    if (!loading){
      if (!isLogin){
        router.push('/login');
      }
      else{
        if (user.ROL_USUARIO != "admin") router.push('/');
      }

    }
  },[]);

  if(!loading && isLogin) return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Panel Admin</h2>

        <nav className="sidebar-menu">
          <h4>Gestión de Datos</h4>
          <button onClick={() => setSection("instituciones")}>Instituciones</button>
          <button onClick={() => setSection("sedes")}>Sedes</button>
          <button onClick={() => setSection("ciudades")}>Ciudades</button>

          <h4>Gestión de Administradores</h4>
          <button onClick={() => setSection("usuarios")}>Lista</button>
          <button onClick={() => setSection("crear-admin")}>Crear Administrador</button>

          <h4>Reportes</h4>
          <button onClick={() => setSection("reporte1")}>Mercado de Arriendos</button>
          <button onClick={() => setSection("reporte2")}>Usuarios Estudiantes</button>
          <button onClick={() => setSection("reporte3")}>Precios de Arriendos</button>
          <button onClick={() => router.push('/')}>Salir</button>
        </nav>
      </aside>

      {/* Content */}
      <main className="content">
        {section === "inicio" && <h1>Bienvenido al Panel de Administración</h1>}

        {section === "instituciones" && (
            <>
            <h1>Gestión de Instituciones</h1>
            <InstitutionsPanel/>
            </>
        )}
        {section === "sedes" && (
          <>
          <h1>Gestión de Sedes</h1>
          <HqsPanel/>
          </>
        )}
        {section === "ciudades" && (
          <>
          <h1>Gestión de Ciudades</h1>
          <CitiesPanel/>
          </>
        )}

        {section === "usuarios" && (
          <AdminUsersList/>
        )}

        {section === "crear-admin" && (
          <RegisterAdmin/>
        )}

        {section === "reporte1" && (
          <Report1Panel/>
        )}
        {section === "reporte2" && (
          <Report2Panel/>
        )}

        {section === "reporte3" && (
          <Report3Panel/>
        )}
      </main>

    </div>
  );
}
