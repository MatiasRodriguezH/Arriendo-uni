import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/usermenu.module.css";

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setOpen(!open);

  function goToMyRentals(){
    router.push('/my-rentals');
  }
  function goToMyProperties(){
    router.push('/my-properties');
  }
  function goToProfile(){
    router.push('/my-profile');
  }
  function goToMySolicitudes(){
    router.push('/my-solicitudes');
  }

  return (
    <div className={styles["user-container"]}>
      <div className={styles["user-info"]} onClick={toggleMenu}>
        <span className={styles["user-name"]}>{user.NOMBRE + " " + user.APELLIDO1}</span>
        <div className={styles["user-picture"]}>
             <img
                src={`../images/profile_pictures/example.jpg`}
                alt="avatar"
            />
        </div>
      </div>

      {open && (
        <div className={styles["dropdown-menu"]}>
          <button className={styles["menu-item"]} onClick={() => goToProfile()}>Perfil</button>
          { (user.ROL_USUARIO == "arrendador") &&(
            <>
            <button className={styles["menu-item"]} onClick={() => goToMyProperties()}>Mis Inmuebles</button>
            <button className={styles["menu-item"]} onClick={() => goToMyRentals()}>Mis Arriendos</button>
            <button className={styles["menu-item"]} onClick={() => goToProfile}>Solicitudes</button>
            </>
          )}
          { (user.ROL_USUARIO == "estudiante") &&(
            <>
            <button className={styles["menu-item"]}>Mis Solicitudes</button>
            <button className={styles["menu-item"]}>Guardados</button>
            </>
          )}
  
          <hr style={{width:'90%', justifySelf:'center', color:'#00638e', margin:'1%'}}></hr>
          { (user.ROL_USUARIO == "administrador") &&(
            <>
            <button className={styles["menu-item"]}>Panel de administración</button>
            </>
          )}
          <button className={styles["menu-item"]}>Configuración</button>
          <button className={`${styles["menu-item"]} ${styles.logout}`} onClick={onLogout}>
            <img className={styles["icon"]} src="/images/icons/logout.svg"/>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
