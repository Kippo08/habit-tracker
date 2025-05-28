import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
import { Menu, X, Plus } from "lucide-react";


export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/stats", label: "Statystyki" },
  ];


  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-border bg-background gap-2">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold tracking-tight">HabitTracker</span>
        {/* Desktop links */}
        <div className="hidden sm:flex gap-2">
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
        {/* Hamburger menu for mobile */}
        <div className="sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
          {mobileMenuOpen && (
            <div className="absolute left-0 top-14 w-full bg-background border-b border-border z-50 flex flex-col items-center gap-2 py-2 shadow">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant={location.pathname === to ? "default" : "ghost"}
                    className="w-full text-base"
                  >
                    {label}
                  </Button>
                </Link>
              ))}
              {/* Plus button in mobile menu */}
              {location.pathname === "/" && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Dodaj nawyk"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/add");
                  }}
                >
                  <Plus />
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                Wyloguj
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Wyloguj i plusik na desktopie */}
      <div className="hidden sm:flex items-center gap-2">
        {location.pathname === "/" && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Dodaj nawyk"
            className="text-2xl"
            onClick={() => navigate("/add")}
          >
            <Plus />
          </Button>
        )}
        <Button variant="outline" onClick={logout}>Wyloguj</Button>
      </div>
    </nav>
  );
}
