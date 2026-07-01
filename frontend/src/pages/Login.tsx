import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Login() {
  const [isReg, setReg] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = `${API}/api/auth/${isReg ? "register" : "login"}`;
      const body = isReg ? { email, password, name } : { email, password };
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Error"); return; }
      setAuth(data.access_token, data.user);
      navigate("/");
    } catch { setError("Connection error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield className="w-10 h-10 text-violet-400" />
          <span className="text-2xl font-bold text-white">ThreatLens</span>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
          <h2 className="text-xl font-semibold text-white">{isReg ? "Create Account" : "Sign In"}</h2>
          {error && <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-2 rounded-lg text-sm">{error}</div>}
          {isReg && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500" required />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors">
            {loading ? "Loading..." : isReg ? "Register" : "Sign In"}
          </button>
          <p className="text-center text-sm text-gray-500">
            {isReg ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => setReg(!isReg)} className="text-violet-400 hover:underline">{isReg ? "Sign In" : "Register"}</button>
          </p>
        </form>
      </div>
    </div>
  );
}
