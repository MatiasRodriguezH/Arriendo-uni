import { useState } from "react";
import "@/styles/user_menu.css";

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <div className="user-container">
      <div className="user-info" onClick={toggleMenu}>
        <span className="user-name">{user.NOMBRE + " " + user.APELLIDO1}</span>
        <div className="user-picture">
             <img
                src={`../images/profile_pictures/example.jpg`}
                alt="avatar"
            />
        </div>
      </div>

      {open && (
        <div className="dropdown-menu">
          <button className="menu-item">Perfil</button>
          { (user.ROL_USUARIO == "arrendador") &&(
            <>
            <button className="menu-item">Mis Inmuebles</button>
            <button className="menu-item">Mis Arriendos</button>
            <button className="menu-item">Solicitudes</button>
            </>
          )}
          { (user.ROL_USUARIO == "estudiante") &&(
            <>
            <button className="menu-item">Mis Solicitudes</button>
            <button className="menu-item">Guardados</button>
            </>
          )}
  
          <hr style={{width:'90%', justifySelf:'center', color:'#00638e', margin:'1%'}}></hr>
          { (user.ROL_USUARIO == "administrador") &&(
            <>
            <button className="menu-item">Panel de administración</button>
            </>
          )}
          <button className="menu-item">Configuración</button>
          <button className="menu-item logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
