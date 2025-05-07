import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/auth/AuthContext";


export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();


  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/add", label: "Dodaj Nawyk" },
    { to: "/stats", label: "Statystyki" },
  ];


  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <div className="flex items-center gap-6">
        <span className="text-xl font-bold tracking-tight">HabitTracker</span>
        {links.map(({ to, label }) => (
          <Link key={to} to={to}>
            <Button
              variant={location.pathname === to ? "default" : "ghost"}
              className="text-sm"
            >
              {label}
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" onClick={() => { logout(); navigate("/auth"); }}>Wyloguj</Button>
      </div>
    </nav>
  );
}
