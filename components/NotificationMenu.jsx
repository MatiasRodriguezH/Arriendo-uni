"use client";

import styles from "@/styles/notificationmenu.module.css";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotificationMenu({idUser}) {
    const [open, setOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState([])
    const boxRef = useRef(null);
    const router = useRouter();
    const [notifSelected, setNotifSelected] = useState('');


    async function selected(notificacion) {
        const result = await fetch(`/api/notifications`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: notificacion.ID_NOTIFICACION}),
        });
        if(notifSelected == notificacion.ID_NOTIFICACION){
            setNotifSelected("");
        }
        else{
            setNotifSelected(notificacion.ID_NOTIFICACION);
        }
        setNotificaciones(notificaciones.map(n => 
            n.ID_NOTIFICACION === notificacion.ID_NOTIFICACION ? {...n, ESTADO: 'leido'} : n
        ));
    }

    useEffect(() => {
        async function fetchNotif(id) {
            const result = await fetch(`/api/notifications?id=${id}`);
            const data = await result.json();
            setNotificaciones(data);
            console.log(data);
        }

        fetchNotif(idUser);

        function handleClickOutside(e) {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, [idUser]);

    const unread = notificaciones.filter(n => n.ESTADO === "nuevo").length;
    const firstThree = notificaciones.slice(0, 3);

    return (
        <div className={styles["notif-wrapper"]} ref={boxRef}>
            {/* Botón */}
            <div
                className= {styles["notif-button"]}
                onClick={() => {setOpen(!open); setNotifSelected("");}}
            >
                <img src="/images/icons/bell-regular.svg"/>

                {unread > 0 && (
                    <div className={styles["notif-badge"]}/>
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className={styles["notif-dropdown"]}>
                    <h4 className={styles["notif-title"]}>Notificaciones</h4>

                    <div className={styles["notif-list"]}>
                        {firstThree.length === 0 && (
                            <p className={styles["notif-empty"]}>No hay notificaciones</p>
                        )}

                        {firstThree.map((n, i) => (
                            <div key={i} className={styles["notif-item"]} onClick={()=> selected(n)}>
                                <div style={{display:'flex'}}>
                                    {n.ESTADO == "nuevo" && (
                                        <div style={{background:'red',width:'5px', height:'auto', marginRight:'0.3rem', borderRadius:'0.5rem'}}/>
                                    )}
                                    <p className={styles["notif-item-title"]}>{n.TITULO}</p>
                                </div>
                                {n.ID_NOTIFICACION == notifSelected &&(
                                    <>
                                    <p className={styles["notif-item-msg"]}>{n.MENSAJE}</p>
                                    <button className={styles["notif-item-go"]} onClick={()=>router.push(n.ENLACE)}>
                                        Ir
                                    </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {notificaciones.length > 0 && (
                        <button className={styles["notif-view-all"]} onClick={()=>router.push('/notifications')}>
                            Ver todas
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
