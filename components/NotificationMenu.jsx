"use client";

import styles from "@/styles/notificationmenu.module.css";
import { useState, useRef, useEffect } from "react";

export default function NotificationMenu({idUser}) {
    const [open, setOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState([])
    const boxRef = useRef(null);

    useEffect(() => {
        async function fetchNotif(id) {
            const result = await fetch(`/api/notifications?id=${id}`);
            const data = await result.json();
            setNotificaciones(data);
        }

        function handleClickOutside(e) {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

        fetchNotif(idUser);
    }, []);

    const unread = notificaciones.filter(n => n.ESTADO === "enviado").length;
    const firstThree = notificaciones.slice(0, 3);

    return (
        <div className={styles["notif-wrapper"]} ref={boxRef}>
            {/* Botón */}
            <div
                className= {styles["notif-button"]}
                onClick={() => setOpen(!open)}
            >
                <img src="/images/icons/bell-regular.svg"/>

                {unread > 0 && (
                    <span className="notif-badge">{unread}</span>
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
                            <div key={i} className={styles["notif-item"]}>
                                <p className={styles["notif-item-title"]}>{n.title}</p>
                                <p className={styles["notif-item-msg"]}>{n.message}</p>
                            </div>
                        ))}
                    </div>

                    {notificaciones.length > 0 && (
                        <button className={styles["notif-view-all"]}>
                            Ver todas
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
