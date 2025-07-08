import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { setAuthToken, fetchVault } from "../services/api";
import {
  addCredential,
  editCredential,
  deleteCredential,
  exportCSV,
  exportPDF,
} from "../services/vault";
import AddCredentialModal from "../components/vault/AddCredentialModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [vault, setVault] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [toast, setToast] = useState("");
  const [showPasswords, setShowPasswords] = useState({});
  const [range, setRange] = useState("3m"); // '3m', '30d', '7d'

  const loadVault = () => {
    setLoading(true);
    fetchVault()
      .then(setVault)
      .catch((err) =>
        setError(err.response?.data?.error || "Failed to load vault")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAuthToken(token);
    loadVault();
  }, []);

  const handleAdd = async (data) => {
    try {
      await addCredential(data);
      setToast("Credential added!");
      loadVault();
    } catch (err) {
      setToast(err.response?.data?.error || "Failed to add credential");
    }
  };

  const handleEdit = async (data) => {
    try {
      await editCredential(editing._id, data);
      setToast("Credential updated!");
      setEditing(null);
      setShowEdit(false);
      loadVault();
    } catch (err) {
      setToast(err.response?.data?.error || "Failed to update credential");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this credential?"))
      return;
    try {
      await deleteCredential(id);
      setToast("Credential deleted!");
      loadVault();
    } catch (err) {
      setToast(err.response?.data?.error || "Failed to delete credential");
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Password copied!");
    } catch {
      setToast("Failed to copy password");
    }
  };

  // Chart data logic must be inside the component:
  function getDayLabel(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const dayMap = {};
  vault.forEach((item) => {
    if (!item.createdAt) return;
    const label = getDayLabel(item.createdAt);
    dayMap[label] = (dayMap[label] || 0) + 1;
  });

  const sortedDays = Object.keys(dayMap)
    .map((label) => ({
      label,
      date: new Date(label),
      count: dayMap[label],
    }))
    .sort((a, b) => a.date - b.date);

  // Range filtering
  let daysToShow = 90;
  if (range === "30d") daysToShow = 30;
  if (range === "7d") daysToShow = 7;
  const chartData = sortedDays.slice(-daysToShow).map(({ label, count }) => ({
    day: label,
    count,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Welcome to your Password Vault
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        This is your secure dashboard. Your credentials will appear below.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {vault.length}
            </div>
            <div className="text-muted-foreground">Stored passwords</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Last Added</CardTitle>
          </CardHeader>
          <CardContent>
            {vault.length > 0 ? (
              <div>
                <div className="font-semibold">
                  {vault[vault.length - 1].site}
                </div>
                <div className="text-muted-foreground text-sm">
                  {vault[vault.length - 1].username}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">No credentials yet</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-2 gap-2">
              <button
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  range === "3m"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
                onClick={() => setRange("3m")}>
                Last 3 months
              </button>
              <button
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  range === "30d"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
                onClick={() => setRange("30d")}>
                Last 30 days
              </button>
              <button
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  range === "7d"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
                onClick={() => setRange("7d")}>
                Last 7 days
              </button>
            </div>
            <div className="h-40 md:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="hsl(var(--muted))"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={24}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      color: "hsl(var(--popover-foreground))",
                      border: "none",
                      borderRadius: 8,
                    }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2">
              Credentials added (
              {range === "3m"
                ? "last 3 months"
                : range === "30d"
                ? "last 30 days"
                : "last 7 days"}
              )
            </div>
          </CardContent>
        </Card>
      </div>
      <div
        className="border rounded p-4 min-h-[120px]"
        style={{
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          borderColor: "hsl(var(--border))",
        }}>
        {loading ? (
          <div className="text-gray-500 text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : vault.length === 0 ? (
          <div className="text-gray-500 text-center">No credentials found.</div>
        ) : (
          <div className="grid gap-4">
            {vault.map((item) => (
              <div
                key={item._id}
                className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between"
                style={{
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  borderColor: "hsl(var(--border))",
                }}>
                <div>
                  <div className="font-semibold">{item.site}</div>
                  <div className="text-sm text-gray-600">{item.username}</div>
                  <div className="text-xs text-gray-400">{item.category}</div>
                  <div className="text-xs text-gray-400">{item.notes}</div>
                </div>
                <div className="mt-2 md:mt-0 flex items-center gap-2">
                  <span
                    className="font-mono px-2 py-1 rounded text-xs"
                    style={{
                      background: "hsl(var(--muted))",
                      color: "hsl(var(--muted-foreground))",
                    }}>
                    {showPasswords[item._id]
                      ? item.password
                      : "•".repeat(item.password.length)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        [item._id]: !prev[item._id],
                      }))
                    }
                    title={
                      showPasswords[item._id]
                        ? "Hide password"
                        : "Show password"
                    }>
                    {showPasswords[item._id] ? (
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
                        className="w-4 h-4">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12s3.75 6.75 9.75 6.75c1.772 0 3.432-.355 4.893-.98M6.228 6.228A10.45 10.45 0 0 1 12 5.25c6 0 9.75 6.75 9.75 6.75a10.49 10.49 0 0 1-4.293 4.774M6.228 6.228l11.543 11.543M6.228 6.228 3 3m15 15-3-3"
                        />
                      </svg>
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(item.password)}
                    title="Copy password to clipboard">
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
                        d="M16.5 8.25V6.75A2.25 2.25 0 0 0 14.25 4.5h-6A2.25 2.25 0 0 0 6 6.75v10.5A2.25 2.25 0 0 0 8.25 19.5h6A2.25 2.25 0 0 0 16.5 17.25v-1.5M9.75 15.75h6A2.25 2.25 0 0 0 18 13.5v-6A2.25 2.25 0 0 0 15.75 5.25h-6A2.25 2.25 0 0 0 7.5 7.5v6a2.25 2.25 0 0 0 2.25 2.25z"
                      />
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(item);
                      setShowEdit(true);
                    }}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={exportCSV}>
          Export CSV
        </Button>
        <Button variant="outline" onClick={exportPDF}>
          Export PDF
        </Button>
        <Button onClick={() => setShowAdd(true)}>Add New Credential</Button>
      </div>
      <AddCredentialModal
        open={showAdd || showEdit}
        onClose={() => {
          setShowAdd(false);
          setShowEdit(false);
          setEditing(null);
        }}
        onAdd={showEdit ? handleEdit : handleAdd}
        credential={showEdit ? editing : null}
      />
      {toast && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow z-50 animate-fade-in">
          {toast}
          <button className="ml-2 text-xs" onClick={() => setToast("")}>
            ✕
          </button>
        </div>
      )}
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
