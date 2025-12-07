"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "@/styles/dashboard/userlist.css"

export default function AdminUsersList() {
  const [users,setUsers] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function fetchAdminUsers(){
        const res = await fetch(`/api/data/users?role=admin`);
        const data = await res.json();
        setUsers(data);
        setLoading(false);
    }

    fetchAdminUsers();
  },[]);

  if(loading) return <p>cargando lista...</p>
  if(!loading && !users) <p>lista vacia</p>

  if(!loading && users) return (
    <div className="admin-users-container">
      <h1>Lista de Administradores</h1>
      {users.map((user) => (
        <Link
          key={user.ID_USUARIO}
          href={`/profile/${user.ID_USUARIO}`}
          className="admin-user-item"
        >
          <img
            src={'/images/'+ user.IMAGEN_PERFIL}
            alt="avatar"
            className="admin-user-avatar"
          />

          <div className="admin-user-info">
            <span className="admin-user-name">{user.NOMBRE +" "+ user.APELLIDO1 +" "+ user.APELLIDO2}</span>
            <span className="admin-user-role">{user.RUT}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
