"use client";

import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLogin, setIsLogin] = useState(false);

  const cargarUsuario = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await fetch("/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user);
        setIsLogin(true);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setIsLogin(false);
      }
    }
  };
  useEffect(() => {
    cargarUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLogin, setUser, setIsLogin, cargarUsuario}}>
      {children}
    </AuthContext.Provider>
  );
};
