import { useState } from "react";
import { Button } from "../components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { requestPasswordReset } from "../services/auth";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset link");
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
          Reset your password
        </div>
        <div className="text-muted-foreground mb-2 text-center text-sm">
          Enter your email to receive a password reset link
        </div>
        {submitted ? (
          <div className="text-green-500 text-center text-sm py-4">
            If an account with that email exists, a reset link has been sent.
          </div>
        ) : (
          <>
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full text-base font-semibold h-10"
              disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
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
