"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, logoutApi } from "@/services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const login = async (tai_khoan, mat_khau) => {
    const res = await loginApi(tai_khoan, mat_khau);
    if (res.success) setUser(res.user);
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
