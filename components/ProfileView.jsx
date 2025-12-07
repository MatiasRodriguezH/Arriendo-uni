"use client";

import styles from "@/styles/profileview.module.css";
import { useRouter } from "next/navigation";

export default function ProfileView( {user, type} ) {
  const router = useRouter();

  if (user) return (
    <div className={styles.container}>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        {type == "me" ? (<h1>Mi Perfil</h1>) : (<h1>Perfil Usuario</h1>)}
        <div className={styles["profile-picture"]}>
          <img src="/images/profile_pictures/example.jpg"/>
        </div>
        <h2>{user.NOMBRE +" "+ user.APELLIDO1 +" "+ (user.APELLIDO2 || "")}</h2>
        <p style={{fontWeight:'bold'}}>{user.ROL_USUARIO.charAt(0).toUpperCase() + user.ROL_USUARIO.slice(1)}</p>
        <p>{user.RUT}</p>
      </div>

      <div className={styles["profile-info"]}>
        <label>Correo electronico</label>
        <p>{user.CORREO}</p>
        {type == "me" && (<><label>Teléfono</label>
        <p>{user.TELEFONO || "-"}</p> </>)}
        <label>Fecha nacimiento</label>
        <p>{user.FECHA_NACIMIENTO + " ( " + user.EDAD + " Años )"}</p>
        <label>Genero</label>
        <p>{user.GENERO || "-"}</p>
        {(user.ROL_USUARIO == "estudiante") && (
          <>
          <label>Institucion</label>
          <p>{user.INSTITUCION || "-"}</p>
          </>
        )}
        {user.ROL_USUARIO == "arrendador" && (
          <>
          <label>Ciudad</label>
          <p>{user.CIUDAD + ", " + user.REGION || "-"}</p>
          </>
        )}
        
        
      </div>

      <br />
      {type == "me" && (
      <button className={styles["edit-button"]} onClick={() => router.push('/my-profile/edit')} >
        <img src="/images/icons/edit.svg"/>
        Editar Perfil
      </button>
      )}
    </div>
  );
}
