"use client";

import {useState, useEffect} from "react";
import BarChartBox from "@/components/dashboard/BarChartBox";
import styles from "@/styles/dashboard/reports.module.css";

export default function Report3Panel() {

    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        async function fetchReportData() {
            const res = await fetch('/api/reports/report3');
            const data = await res.json();
            setReportData(data);
        }
        fetchReportData();
        console.log(reportData);
    }, []);

    if (!reportData) return <p>Cargando reporte...</p>;

    return (
        <div className={styles["dashboard-container"]}>
            <h1>Reporte Precios de Arriendos</h1>

            <div className={styles["grid"]}>
                <BarChartBox
                    title="Precio promedio de arriendos por tipo"
                    data={reportData.precioTipo.map(x => ({
                        tipo: x.TIPO_ARRIENDO,
                        total: x.PRECIO_PROMEDIO
                    }))}
                />

                <div display="flex" flexDirection="column" gap="10px">
                    <h2 style={{marginBottom:'1rem'}}>Estadistica de precios en los arriendos de intéres por los usuarios</h2>
                    <div style={{}}></div>
                </div>

                <div display="flex" flexDirection="column" gap="10px">
                    <h2 style={{marginBottom:'1rem'}}>Ciudades con mayor precio promedio de arriendo</h2>
                    {reportData.precioCiudadMayores.map(x => (
                        <div style={{padding:'0.5rem 1rem',borderRadius:'1rem',backgroundColor:'white', margin:'0.5rem 0rem',
                         display:'flex', justifyContent:'space-between'}} key={x.CIUDAD}>
                            <strong>{x.CIUDAD}</strong><span style={{marginRight:'0.5rem'}}>{x.PRECIO_PROMEDIO}</span></div>
                    ))}
                </div>

                <div display="flex" flexDirection="column" gap="10px">
                    <h2 style={{marginBottom:'1rem'}}>Ciudades con menor precio promedio de arriendo</h2>
                    {reportData.precioCiudadMenores.map(x => (
                        <div style={{padding:'0.5rem 1rem',borderRadius:'1rem',backgroundColor:'white', margin:'0.5rem 0rem',
                         display:'flex', justifyContent:'space-between'}} key={x.CIUDAD}>
                            <strong>{x.CIUDAD}</strong><span style={{marginRight:'0.5rem'}}>{x.PRECIO_PROMEDIO}</span></div>
                    ))}
                </div>

                <div display="flex" flexDirection="column" gap="10px">
                    <h2 style={{marginBottom:'1rem'}}>Regiones con mayor precio promedio de arriendo</h2>
                    {reportData.precioRegionMayores.map(x => (
                        <div style={{padding:'0.5rem 1rem',borderRadius:'1rem',backgroundColor:'white', margin:'0.5rem 0rem',
                         display:'flex', justifyContent:'space-between'}} key={x.CIUDAD}>
                            <strong>{x.REGION}</strong><span style={{marginRight:'0.5rem'}}>{x.PRECIO_PROMEDIO}</span></div>
                    ))}
                </div>

                <div display="flex" flexDirection="column" gap="10px">
                    <h2 style={{marginBottom:'1rem'}}>Regiones con menor precio promedio de arriendo</h2>
                    {reportData.precioRegionMenores.map(x => (
                        <div style={{padding:'0.5rem 1rem',borderRadius:'1rem',backgroundColor:'white', margin:'0.5rem 0rem',
                         display:'flex', justifyContent:'space-between'}} key={x.CIUDAD}>
                            <strong>{x.REGION}</strong><span style={{marginRight:'0.5rem'}}>{x.PRECIO_PROMEDIO}</span></div>
                    ))}
                </div>
                
                
            </div>
        </div>
    )
}