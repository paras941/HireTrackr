import { createContext, useContext, useEffect, useMemo, useState } from "react";
import http from "../api/http";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("hiretrackr_token");
    if (!token) {
      setLoading(false);
      return;
    }
    http
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("hiretrackr_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, profile) => {
    localStorage.setItem("hiretrackr_token", token);
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("hiretrackr_token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
