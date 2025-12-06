"use client";

import {useState, useEffect} from "react";
import BarChartBox from "@/components/dashboard/BarChartBox";
import styles from "@/styles/dashboard/reports.module.css";

export default function Report2Panel() {

    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        async function fetchReportData() {
            const res = await fetch('/api/reports/report2');
            const data = await res.json();
            setReportData(data);
        }
        fetchReportData();
        console.log(reportData);
    }, []);

    if (!reportData) return <p>Cargando reporte...</p>;

    return (
        <div className={styles["dashboard-container"]}>
            <h1>Reporte Usuarios Estudiantes</h1>

            <div className={styles["grid"]}>
                <div display="flex" flexDirection="column" gap="10px">
                    <h2 style={{marginBottom:'1rem'}}>Top 5 Instituciones con más usuarios estudiantes</h2>
                    {reportData.estudiantesInstitucion.map(x => (
                        <div style={{padding:'0.5rem 1rem',borderRadius:'1rem',backgroundColor:'white', margin:'0.5rem 0rem',
                         display:'flex', justifyContent:'space-between'}} key={x.ID_INSTITUCION}>
                            <strong>{x.NOMBRE}</strong><span style={{marginRight:'0.5rem'}}>{x.TOTAL_ESTUDIANTES}</span></div>
                    ))}
                </div>
                

                <div display="flex" flexDirection="column" gap="10px">
                    <h2 style={{marginBottom:'1rem'}}>Top 5 ciudades con más usuarios estudiantes</h2>
                    {reportData.estudiantesCiudad.map(x => (
                        <div style={{padding:'0.5rem 1rem',borderRadius:'1rem',backgroundColor:'white', margin:'0.5rem 0rem',
                         display:'flex', justifyContent:'space-between'}} key={x.ID_INSTITUCION}>
                            <strong>{x.NOMBRE}</strong><span style={{marginRight:'0.5rem'}}>{x.TOTAL_ESTUDIANTES}</span></div>
                    ))}
                </div>
                <BarChartBox
                    title="Regiones por  numero de usuarios estudiantes"
                    data={reportData.estudiantesRegion.map(x => ({
                        tipo: x.NOMBRE,
                        total: x.TOTAL_ESTUDIANTES
                    }))}
                />

            </div>
        </div>
    )
}