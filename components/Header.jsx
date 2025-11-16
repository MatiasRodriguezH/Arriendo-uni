"use client";

import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Link from "next/link";
//import LoginForm from './LoginForm'; // Asegúrate de importar tu componente LoginForm
//import SigninForm from './SigninForm';
//import { useLoginContext } from '../context/LoginFormContext';
import '../styles/header.css'

export default function Header() {
  const { user, isLogin } =  useContext(AuthContext);
  const { showLogin, setShowLogin } = useState(false)//useLoginContext();
  const [showSignin, setShowSignin] = useState(false);

  return (
    <div className="header">
      <div className='logo'>
        <img className='image' src="/images/logo.png"/>
        <a className='title' href="/">TUCAMPUS</a>
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
        <div className='user-info'>
            <span style={{position:'absolute', right:'40%'}}>{user.username}</span>
            <img style={{textAlign:'right', height: '100%'}} src={`/static/images/avatars/${user.avatar ? user.avatar:'profile_picture.jpg'}`} alt="Avatar" className="avatar" />
        </div>
      )}
    </div>
    
  );
}