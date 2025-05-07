import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
  getUserData,
  setUserData,
} from "@/utils/storage";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (username, password) => {
    const userData = getUserData(username);
    if (!userData || userData.password !== password) return false;
    setUser({ username });
    setCurrentUser(username);
    window.location.replace("/"); // Pełne przeładowanie aplikacji
    return true;
  };

  const register = (username, password) => {
    if (getUserData(username)) return false;
    setUserData(username, { password, habits: [], stats: [] });
    setUser({ username });
    setCurrentUser(username);
    window.location.replace("/"); // Pełne przeładowanie aplikacji
    return true;
  };

  const logout = () => {
    setUser(null);
    removeCurrentUser();
    window.location.replace("/auth"); // Pełne przeładowanie aplikacji
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
