import React from "react";
import Header from "@/components/Header";
import RentalPage from "./RentalPage";

async function fetchArriendo(slug) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/arriendos/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ArriendoPage({ params }) {
  const { slug } = await params;
  const rental = await fetchArriendo(slug);

  if (!rental) {
    return (
      <div>
        <Header />
        <div className="catalog">
          <h1>Arriendo no encontrado</h1>
          <p>El arriendo "{slug}" no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <RentalPage rental={rental}/>
    </>
  );
}