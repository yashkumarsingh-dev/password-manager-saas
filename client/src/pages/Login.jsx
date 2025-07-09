import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { login as loginUser } from "../services/auth";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", token: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser(form.email, form.password, form.token);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("userId", res.userId);
      // Fetch user status from backend
      try {
        const meRes = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${res.accessToken}` },
        });
        localStorage.setItem("isPro", meRes.data.isPro ? "true" : "false");
        console.log("[DEBUG] isPro from backend:", meRes.data.isPro);
      } catch (err) {
        localStorage.setItem("isPro", "false");
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="flex flex-1 h-screen items-start justify-center pt-8 overflow-hidden">
      <div className="w-full max-w-md mx-auto pt-8 animate-fade-in">
        <a
          href="/"
          className="block mb-4 text-sm text-muted-foreground hover:underline text-center">
          ← Back to Home
        </a>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-2xl p-4 space-y-4 border border-border">
          <div className="text-2xl font-bold mb-0 text-center">
            Login to your account
          </div>
          <div className="text-muted-foreground mb-2 text-center text-sm">
            Enter your email below to login to your account
          </div>
          <div>
            <label
              className="block mb-0.5 font-medium text-left text-sm"
              htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="font-medium text-sm" htmlFor="password">
                Password
              </label>
              <RouterLink
                to="/reset-password"
                className="text-xs text-muted-foreground hover:underline">
                Forgot your password?
              </RouterLink>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label
              className="block mb-0.5 font-medium text-left text-sm"
              htmlFor="token">
              2FA Code
            </label>
            <input
              id="token"
              name="token"
              type="text"
              placeholder="Enter 2FA code"
              autoComplete="one-time-code"
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <Button type="submit" className="w-full text-base font-semibold h-10">
            Login
          </Button>
          <div className="text-center text-xs mt-1 text-muted-foreground">
            Don't have an account?{" "}
            <a href="/register" className="underline">
              Sign up
            </a>
          </div>
          {error && (
            <div className="mt-1 text-red-600 text-xs text-center">{error}</div>
          )}
        </form>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 1.2s ease; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
