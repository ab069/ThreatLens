import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useThreatStore } from "../store/threatStore";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Threats() {
  const token = useAuthStore((s) => s.token);
  const { threats, setThreats } = useThreatStore();

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/threats`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => { if (Array.isArray(d)) setThreats(d); }).catch(() => {});
  }, [token]);

  const sevColor = (s: string) => {
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
      <h1 className="text-2xl font-bold text-white">Threat Intelligence</h1>
      <div className="space-y-3">
        {threats.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
            No threats generated. Add IoCs and click the analyze button to generate threat intelligence.
          </div>
        ) : (
          threats.map((t) => (
            <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold">{t.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded border ${sevColor(t.severity)}`}>{t.severity}</span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{t.threat_type}</span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">conf: {t.confidence}</span>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 mb-3">
                <p className="text-sm text-gray-300">{t.description}</p>
              </div>
              {t.mitre_ttps?.techniques && (
                <div className="flex flex-wrap gap-2">
                  {t.mitre_ttps.techniques.map((ttp: any) => (
                    <span key={ttp.id} className="text-xs bg-gray-800 text-violet-400 px-2 py-1 rounded border border-violet-900">
                      {ttp.id} - {ttp.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
