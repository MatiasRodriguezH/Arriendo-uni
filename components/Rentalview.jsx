"use client";

import { useState } from "react";
import "../styles/items.css"

export default function Rentalview(){
    return(
        <div className="rentview-container">
            <img src='./images/example.jpg'></img>
            <div className="info">
                <div className="tags">
                    <div className="type-property">
                        <span style={{color:'white', margin:'0px 10px 0px 10px'}}>casa</span>
                    </div>
                    <div className="type-rental">
                        <span style={{color:'white', margin:'0px 10px 0px 10px'}}>por dormitorios</span>
                    </div>
                </div>
                <span style={{textAlign:'start'}}>Titulo del arriendo</span>
                <span style={{textAlign:'start', fontWeight:'bolder', fontSize:'1.2vw', marginBottom:'1%'}}>$999.999</span>
                <span style={{textAlign:'start'}}>N Habitaciones | M baños</span>
                <span style={{textAlign:'start', color:'grey'}}>Direccion</span>
                <span style={{textAlign:'start', color:'#00638e'}}>Cercano a X ubicacion</span>
            </div>
        </div>
    );
}