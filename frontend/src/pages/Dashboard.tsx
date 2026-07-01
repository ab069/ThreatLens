import { useEffect, useState } from "react";
import { Shield, Fingerprint, AlertTriangle, Activity } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useThreatStore } from "../store/threatStore";
import { useWebSocket } from "../hooks/useWebSocket";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Dashboard() {
  const token = useAuthStore((s) => s.token);
  const threats = useThreatStore((s) => s.threats);
  const [iocCount, setIocCount] = useState(0);
  const [threatCount, setThreatCount] = useState(0);
  useWebSocket();

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/iocs`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => setIocCount(d.length || 0)).catch(() => {});
    fetch(`${API}/api/threats`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => setThreatCount(d.length || 0)).catch(() => {});
  }, [token]);

  const sevColor = (s: string) => {
    const m: Record<string, string> = {
      critical: "text-red-500 bg-red-900/30 border-red-800",
      high: "text-orange-500 bg-orange-900/30 border-orange-800",
      medium: "text-yellow-500 bg-yellow-900/30 border-yellow-800",
      low: "text-green-500 bg-green-900/30 border-green-800",
    };
    return m[s] || "text-gray-400 bg-gray-800 border-gray-700";
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-sm">Indicators (IoCs)</p><p className="text-3xl font-bold text-white mt-1">{iocCount}</p></div>
            <Fingerprint className="w-10 h-10 text-violet-400/50" />
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-sm">Threats Identified</p><p className="text-3xl font-bold text-white mt-1">{threatCount}</p></div>
            <AlertTriangle className="w-10 h-10 text-red-400/50" />
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-400 text-sm">Active High/Critical</p><p className="text-3xl font-bold text-white mt-1">
              {threats.filter((t) => t.severity === "critical" || t.severity === "high").length}
            </p></div>
            <Activity className="w-10 h-10 text-yellow-400/50" />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Live Threat Feed</h2>
        {threats.length === 0 ? (
          <p className="text-gray-500 text-sm">No threats yet. Add IoCs and analyze them to see threat intelligence.</p>
        ) : (
          <div className="space-y-3">
            {threats.slice(0, 10).map((t) => (
              <div key={t.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{t.name}</span>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${sevColor(t.severity)}`}>{t.severity}</span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{t.confidence}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{t.description}</p>
                <p className="text-xs text-gray-600 mt-2">{new Date(t.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
