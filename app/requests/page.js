"use client";

import Header from "@/components/Header";
import RequestsList from "@/app/requests/RequestsList";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function ResquestPage() {
    return (
        <>
            <Header />
            <RequestsList idUser={2}/>
        </>
    )
}