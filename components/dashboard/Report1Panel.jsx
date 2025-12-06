"use client";

import {useState, useEffect} from "react";
import BarChartBox from "@/components/dashboard/BarChartBox";
import styles from "@/styles/dashboard/reports.module.css";

export default function Report1Panel() {

    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        async function fetchReportData() {
            const res = await fetch('/api/reports/report1');
            const data = await res.json();
            setReportData(data);
        }
        fetchReportData();
        console.log(reportData);
    }, []);
    
    if (!reportData) return <p>Cargando reporte...</p>;

    return (
        <div className={styles["dashboard-container"]}>
            <h1>Reporte Mercado de Arriendos</h1>

            <div className={styles["grid"]}>
                <BarChartBox
                    title="Tipos de Arriendo Más Solicitados"
                    data={reportData.arriendoDemanda.map(x => ({
                        tipo: x.TIPO_ARRIENDO,
                        total: x.TOTAL_SOLICITUDES
                    }))}
                />

                <BarChartBox
                    title="Tipos de Arriendo Más Ofertados"
                    data={reportData.arriendoOferta.map(x => ({
                        tipo: x.TIPO_ARRIENDO,
                        total: x.TOTAL_OFERTAS
                    }))}
                />

                <BarChartBox
                    title="Tipos de Inmueble Más Solicitados"
                    data={reportData.inmuebleDemanda.map(x => ({
                        tipo: x.TIPO_INMUEBLE,
                        total: x.TOTAL_SOLICITUDES
                    }))}
                />

                <BarChartBox
                    title="Tipos de Inmueble Más Ofertados"
                    data={reportData.inmuebleOferta.map(x => ({
                        tipo: x.TIPO_INMUEBLE,
                        total: x.TOTAL_OFERTAS
                    }))}
                />
            </div>
        </div>
    );
}