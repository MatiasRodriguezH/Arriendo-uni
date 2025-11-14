"use client";

import { useState } from "react";
import "../styles/rentalview.css"

export default function Rentalview({data}){
    return(
        <div className="rentview-container">
            <img src='./images/example.jpg'></img>
            <div className="info">
                <div className="tags-container">
                    <div className="tag">
                        <span style={{color:'white'}}>{data.TIPO_INMUEBLE}</span>
                    </div>
                    <div className="tag">
                        <span style={{color:'white'}}>{data.TIPO_ARRIENDO}</span>
                    </div>
                </div>
                <span style={{textAlign:'start'}}>{data.TITULO}</span>
                <span style={{textAlign:'start', fontWeight:'bolder', fontSize:'1.2vw', marginBottom:'1%'}}>{data.PRECIO}</span>
                <span style={{textAlign:'start'}}>{data.NUM_HABITACIONES} Habitaciones | {data.NUM_BANIOS} baños</span>
                <span style={{textAlign:'start', color:'grey'}}>{data.DIRECCION}</span>
                <span style={{textAlign:'start', color:'#00638e'}}>Cercano a X ubicacion</span>
            </div>
        </div>
    );
}