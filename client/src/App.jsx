import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TwoFactor from "./pages/TwoFactor";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import SetNewPassword from "./pages/SetNewPassword";
import { Button } from "./components/ui/button";
import { useEffect } from "react";
import "./App.css";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <>
      <nav
        className="flex items-center justify-between px-6 py-3 mb-6 border-b"
        style={{
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          borderColor: "hsl(var(--border))",
        }}>
        <div className="font-bold text-xl">
          <Link to="/dashboard">🔒 Password Manager</Link>
        </div>
        {!(
          location.pathname === "/login" ||
          location.pathname === "/register" ||
          location.pathname === "/reset-password"
        ) && (
          <div className="flex items-center gap-2">
            {!isLoggedIn && (
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
            {!isLoggedIn && (
              <Link to="/register">
                <Button variant="outline">Register</Button>
              </Link>
            )}
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
            {isLoggedIn && (
              <Link to="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
            )}
            {isLoggedIn && (
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        )}
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/2fa" element={<TwoFactor />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<SetNewPassword />} />
      </Routes>
    </>
  );
}
