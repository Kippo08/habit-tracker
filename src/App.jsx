import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import Dashboard from "./pages/Dashboard";
import AddHabitPage from "./pages/AddHabitPage";
import StatsPage from "./pages/StatsPage";
import AuthPage from "./pages/AuthPage";
import { Toaster } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddHabitPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <StatsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster richColors position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
