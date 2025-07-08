import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import zxcvbn from "zxcvbn";
import api from "../../services/api";

export default function AddCredentialModal({
  open,
  onClose,
  onAdd,
  credential,
}) {
  const isEdit = !!credential;
  const [form, setForm] = useState(
    credential || {
      site: "",
      username: "",
      password: "",
      category: "",
      notes: "",
    }
  );

  const [strength, setStrength] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (credential) {
      setForm(credential);
      setStrength(credential.password ? zxcvbn(credential.password) : null);
    } else {
      setForm({
        site: "",
        username: "",
        password: "",
        category: "",
        notes: "",
      });
      setStrength(null);
    }
  }, [credential, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setStrength(zxcvbn(value));
    }
  };

  const handleGenerate = async () => {
    setGenLoading(true);
    try {
      const res = await api.post("/utils/generate-password", {
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
      });
      setForm((prev) => ({ ...prev, password: res.data.password }));
      setStrength(zxcvbn(res.data.password));
    } catch {
      // Optionally show error
    } finally {
      setGenLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    if (!isEdit) {
      setForm({
        site: "",
        username: "",
        password: "",
        category: "",
        notes: "",
      });
      setStrength(null);
    }
    onClose();
  };

  if (!open) return null;

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-blue-400",
    "bg-green-500",
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-5 text-center text-foreground">
          {isEdit ? "Edit Credential" : "Add New Credential"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="site"
            placeholder="Site"
            value={form.site}
            onChange={handleChange}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <div>
            <div className="flex gap-2 items-center">
              <div className="relative w-full">
                <input
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-border rounded-lg px-3 py-2 pr-10 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12s3.75-6.75 9.75-6.75 9.75 6.75 9.75 6.75-3.75 6.75-9.75 6.75S2.25 12 2.25 12z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12s3.75 6.75 9.75 6.75c1.772 0 3.432-.355 4.893-.98M6.228 6.228A10.45 10.45 0 0 1 12 5.25c6 0 9.75 6.75 9.75 6.75a10.49 10.49 0 0 1-4.293 4.774M6.228 6.228l11.543 11.543M6.228 6.228 3 3m15 15-3-3"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleGenerate}
                disabled={genLoading}
                title="Generate password">
                {genLoading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75A2.25 2.25 0 0 0 14.25 4.5h-4.5A2.25 2.25 0 0 0 7.5 6.75v3.75m9 0V17.25A2.25 2.25 0 0 1 14.25 19.5h-4.5A2.25 2.25 0 0 1 7.5 17.25V10.5m9 0h-9"
                    />
                  </svg>
                )}
              </Button>
            </div>
            {form.password && strength && (
              <div className="mt-1 flex items-center gap-2">
                <div
                  className={`h-2 w-24 rounded ${
                    strengthColors[strength.score]
                  }`}></div>
                <span className="text-xs text-gray-600">
                  {strengthLabels[strength.score]}
                </span>
              </div>
            )}
          </div>
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-lg px-6 py-2">
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
              {isEdit ? "Save" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
