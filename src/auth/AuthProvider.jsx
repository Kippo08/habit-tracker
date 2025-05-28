import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import {
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
  getUserData,
  setUserData,
} from "@/utils/storage";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
    window.location.replace("/");
    return true;
  };

  const register = (username, password) => {
    if (getUserData(username)) return false;
    setUserData(username, { password, habits: [], stats: [] });
    setUser({ username });
    setCurrentUser(username);
    window.location.replace("/");
    return true;
  };

  const logout = () => {
    setUser(null);
    removeCurrentUser();
    window.location.replace("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
