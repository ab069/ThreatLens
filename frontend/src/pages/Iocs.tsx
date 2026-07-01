import { useEffect, useState } from "react";
import { Plus, Trash2, Zap } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useWebSocket } from "../hooks/useWebSocket";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
const IOC_TYPES = ["ip", "domain", "url", "hash", "email", "registry_key"];

interface IoC { id: string; ioc_type: string; value: string; source: string | null; severity: string; is_active: boolean; created_at: string }

export default function Iocs() {
  const token = useAuthStore((s) => s.token)!;
  const [iocs, setIocs] = useState<IoC[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("ip");
  const [value, setValue] = useState("");
  const [source, setSource] = useState("");
  const [severity, setSeverity] = useState("medium");
  const { send } = useWebSocket();

  const fetchIocs = async () => {
    const res = await fetch(`${API}/api/iocs`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setIocs(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchIocs(); }, [token]);

  const createIoc = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API}/api/iocs`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ioc_type: type, value, source, severity }),
    });
    setValue(""); setShowForm(false);
    fetchIocs();
  };

  const deleteIoc = async (id: string) => {
    await fetch(`${API}/api/iocs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchIocs();
  };

  const analyzeIoc = async (ioc: IoC) => {
    send({ action: "analyze_ioc", ioc_id: ioc.id });
  };

  const sevBadge = (s: string) => {
    const m: Record<string, string> = {
      critical: "bg-red-900/30 text-red-400 border-red-800",
      high: "bg-orange-900/30 text-orange-400 border-orange-800",
      medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
      low: "bg-green-900/30 text-green-400 border-green-800",
    };
    return m[s] || "bg-gray-800 text-gray-400 border-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Indicators of Compromise</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> New IoC
        </button>
      </div>

      {showForm && (
        <form onSubmit={createIoc} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500">
                {IOC_TYPES.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Severity</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500">
                {["low", "medium", "high", "critical"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Value</label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 font-mono text-sm" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Source (optional)</label>
              <input type="text" value={source} onChange={(e) => setSource(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-lg transition-colors">Create</button>
            <button type="button" onClick={() => setShowForm(false)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg transition-colors">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {iocs.map((ioc) => (
              <tr key={ioc.id} className="border-b border-gray-800 text-sm">
                <td className="px-6 py-4"><span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">{ioc.ioc_type.toUpperCase()}</span></td>
                <td className="px-6 py-4 text-white font-mono text-xs max-w-[300px] truncate">{ioc.value}</td>
                <td className="px-6 py-4 text-gray-500">{ioc.source || "-"}</td>
                <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded border ${sevBadge(ioc.severity)}`}>{ioc.severity}</span></td>
                <td className="px-6 py-4 text-gray-500">{new Date(ioc.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => analyzeIoc(ioc)}
                    className="text-violet-500 hover:text-violet-400 transition-colors" title="Analyze with AI">
                    <Zap className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteIoc(ioc.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {iocs.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No indicators added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
