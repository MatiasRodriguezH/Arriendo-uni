"use client";

import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const cargarUsuario = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      
      const response = await fetch("http://localhost:3000/api/profile", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const user = await response.json();
        if(user[0]){
          setUser(user[0]);
          setIsLogin(true);
        }
        else{
          localStorage.removeItem("token");
          setUser(null);
          setIsLogin(false);
        }
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setIsLogin(false);
      }
    }

    setLoading(false);
  };
  useEffect(() => {
    cargarUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLogin, loading, setUser, setIsLogin, cargarUsuario}}>
      {children}
    </AuthContext.Provider>
  );
};
