"use client";

import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Link from "next/link";
import '@/styles/header.css'
import UserMenu from './UserMenu';

export default function Header() {
  const { user, isLogin } =  useContext(AuthContext);
  const { showLogin, setShowLogin } = useState(false)//useLoginContext();
  const [showSignin, setShowSignin] = useState(false);


  return (
    <div className="header">
      <div className='logo'>
        <img className='image' src="/images/logo.png"/>
        <a style={{color:'white', textDecoration:'none'}} className='title' href="/">TUCAMPUS</a>
      </div>

      {!isLogin ? (
        <>
          <div style={{height:'70%', width:'6%', marginLeft:'auto'}}>
            <Link href='/registration'>
              <button className="signin-btn" id="signin-btn">
                Registrarse
              </button>
            </Link>
          </div>
          <div style={{height:'70%', width:'6%', marginLeft:'1%', marginRight:'1%'}}>
            <Link href='/login'>
              <button className="login-btn" id="login-btn">
                Ingresar
              </button>
            </Link>
          </div>
        </>
      ) : (
        <UserMenu user={user} onLogout={() => {
        localStorage.removeItem("token");
        window.location.reload();
        }}/>
      )}
    </div>
    
  );
}