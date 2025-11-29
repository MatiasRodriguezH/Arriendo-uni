"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import UpdateForm from "@/components/UpdateForm";

export default function EditProfile() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;

  if (!user) return <p>No estás autenticado.</p>;

  return (
    <UpdateForm user={user} />
  );
}
