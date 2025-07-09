import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { register as registerUser } from "../services/auth";
import { QRCodeCanvas } from "qrcode.react";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOtpauthUrl("");
    // Clear user-related localStorage keys on registration
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("isPro");
    try {
      const res = await registerUser(form.email, form.password);
      setOtpauthUrl(res.twoFactorSecret);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center pt-8 overflow-y-auto">
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
            Create an account
          </div>
          <div className="text-muted-foreground mb-2 text-center text-sm">
            Enter your email below to create your account
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
            <label
              className="block mb-0.5 font-medium text-left text-sm"
              htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <Button type="submit" className="w-full text-base font-semibold h-10">
            Register
          </Button>
          <div className="text-center text-xs mt-1 text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Login
            </a>
          </div>
          {otpauthUrl && (
            <div className="mt-3 p-2 bg-green-100 border rounded text-xs text-green-900 dark:bg-green-900/20 dark:text-green-200">
              Registration successful!
              <br />
              <span className="font-bold">
                Scan this QR code in your authenticator app:
              </span>
              <br />
              <div className="flex justify-center my-2">
                <div className="flex flex-col items-center w-full">
                  <QRCodeCanvas
                    value={otpauthUrl}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin={true}
                  />
                  <span
                    className="block mt-2 bg-white text-black p-1 rounded w-full text-center select-all overflow-x-auto"
                    style={{ whiteSpace: "nowrap" }}>
                    {otpauthUrl}
                  </span>
                </div>
              </div>
            </div>
          )}
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
