import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const username = localStorage.getItem("habit-current-user"); // Pobranie nazwy użytkownika z localStorage
  return user || username ? children : <Navigate to="/auth" replace />;
}
