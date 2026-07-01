import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Activity, Fingerprint, AlertTriangle, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: Activity },
  { to: "/iocs", label: "Indicators", icon: Fingerprint },
  { to: "/threats", label: "Threats", icon: AlertTriangle },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Shield className="w-8 h-8 text-violet-400" />
          <span className="text-xl font-bold text-white">ThreatLens</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? "bg-violet-600/20 text-violet-400 border border-violet-800" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}>
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-3 truncate">{user?.name}</div>
          <button onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors text-sm w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto"><Outlet /></main>
    </div>
  );
}
