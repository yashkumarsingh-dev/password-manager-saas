import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { resetPassword } from "../services/auth";
import { Button } from "../components/ui/button";

export default function SetNewPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 h-screen items-start justify-center pt-8 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-2xl p-4 space-y-4 border border-border">
        <div className="text-2xl font-bold mb-0 text-center">
          Set a new password
        </div>
        <div className="text-muted-foreground mb-2 text-center text-sm">
          Enter your new password below
        </div>
        {success ? (
          <div className="text-green-500 text-center text-sm py-4">
            Your password has been reset.{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        ) : (
          <>
            <div>
              <label
                className="block mb-0.5 font-medium text-left text-sm"
                htmlFor="password">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="New password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label
                className="block mb-0.5 font-medium text-left text-sm"
                htmlFor="confirm">
                Confirm Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="Confirm password"
                autoComplete="new-password"
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full text-base font-semibold h-10"
              disabled={loading}>
              {loading ? "Resetting..." : "Set new password"}
            </Button>
            {error && (
              <div className="text-red-600 text-xs text-center mt-1">
                {error}
              </div>
            )}
          </>
        )}
        <div className="text-center text-xs mt-1 text-muted-foreground">
          <Link to="/login" className="underline">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}
