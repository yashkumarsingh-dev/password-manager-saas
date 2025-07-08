import { useState } from "react";
import { Button } from "../components/ui/button";
import { verify2FA } from "../services/auth";

export default function TwoFactor() {
  const [form, setForm] = useState({ email: "", token: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await verify2FA(form.email, form.token);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "2FA verification failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="input w-full border rounded px-3 py-2"
      />
      <input
        name="token"
        type="text"
        placeholder="2FA Code"
        onChange={handleChange}
        className="input w-full border rounded px-3 py-2"
      />
      <Button type="submit" className="w-full">
        Verify 2FA
      </Button>
      {success && (
        <div className="mt-2 text-green-600 text-sm">
          2FA verified successfully!
        </div>
      )}
      {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
    </form>
  );
}
