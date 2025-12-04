"use client";

import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import styles from '@/styles/header.module.css'
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu';

export default function Header() {
  const { user, isLogin } =  useContext(AuthContext);
  const { showLogin, setShowLogin } = useState(false)//useLoginContext();
  const [showSignin, setShowSignin] = useState(false);
  const router = useRouter();

  function goToLogin(){
    router.push('/login');
  }
  function goToRegistration(){
    router.push('/registration');
  }
  function goToNewRental(){
    router.push('/my-rentals/new');
  }

  function goToMyRentals(){
    router.push('/my-rentals')
  }

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img className={styles.image} src="/images/logo.png"/>
        <a className={styles.title} href="/">TUCAMPUS</a>
      </div>

      {!isLogin ? (
        <>
          <div style={{display:'flex', gap:'1rem'}}>
            <button className={styles["action-btn"]} onClick={()=> goToRegistration()}>
              Registrarse
            </button>
            <button className={styles["action-btn"]} onClick={()=> goToLogin()}>
              Ingresar
            </button>
          </div>
        </>
      ) : (
        <>
        
        <NotificationMenu idUser={user.ID_USUARIO}/>

        {user.ROL_USUARIO == "arrendador" && (
          <div style={{margin:'0rem 1rem'}}>
            <button className={styles["action-btn"]} onClick={()=> goToNewRental()}>
              + Nuevo Arriendo
            </button>
          </div>
        )}

        <UserMenu user={user} onLogout={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}/>

        
        </>
        
      )}
    </div>
    
  );
}