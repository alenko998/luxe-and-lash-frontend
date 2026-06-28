import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, register as registerApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (data) => {
    const res = await loginApi(data);
    const userData = res.data;
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await registerApi(data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);