"use client";

import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import styles from '@/styles/header.module.css'
import UserMenu from './UserMenu';

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
        {user.ROL_USUARIO == "arrendador" && (
          <div style={{ width:'10%', marginLeft:'auto'}}>
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