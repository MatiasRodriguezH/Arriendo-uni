"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/dashboard.css";
import InstitutionsPanel from "@/components/dashboard/InstitutionsPanel";
import HqsPanel from "@/components/dashboard/HqsPanel";
import CitiesPanel from "@/components/dashboard/CitiesPanel";

export default function Dashboard() {
  const [section, setSection] = useState("inicio");
  const router = useRouter();

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Panel Admin</h2>

        <nav className="sidebar-menu">
          <h4>Gestión de Datos</h4>
          <button onClick={() => setSection("instituciones")}>Instituciones</button>
          <button onClick={() => setSection("sedes")}>Sedes</button>
          <button onClick={() => setSection("ciudades")}>Ciudades</button>
          <button onClick={() => setSection("regiones")}>Regiones</button>

          <h4>Gestión de Usuarios</h4>
          <button onClick={() => setSection("usuarios")}>Usuarios</button>
          <button onClick={() => setSection("crear-admin")}>Crear Administrador</button>

          <h4>Reportes</h4>
          <button onClick={() => setSection("reporte1")}>Demanda de Arriendos</button>
          <button onClick={() => setSection("reporte2")}>Usuarios Activos</button>
          <button onClick={() => setSection("reporte3")}>Ingresos</button>
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
        {section === "regiones" && <h1>Gestión de Regiones</h1>}

        {section === "usuarios" && <h1>Gestión de Usuarios</h1>}
        {section === "crear-admin" && <h1>Crear Nuevo Administrador</h1>}

        {section === "reporte1" && <h1>Reporte: Mercado de Arriendos</h1>}
        {section === "reporte2" && <h1>Reporte: Usuario e Instituciones</h1>}
        {section === "reporte3" && <h1>Reporte: Ingresos al Sistema</h1>}
      </main>

    </div>
  );
}
