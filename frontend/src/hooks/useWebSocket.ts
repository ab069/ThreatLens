import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { useThreatStore } from "../store/threatStore";

const WS_BASE = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:8000`;

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useAuthStore();
  const addThreat = useThreatStore((s) => s.addThreat);

  useEffect(() => {
    if (!user) return;
    const ws = new WebSocket(`${WS_BASE}/ws/${user.id}`);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "threat") addThreat(data.threat);
      } catch { /* ignore */ }
    };
    return () => ws.close();
  }, [user]);

  const send = (data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify(data));
  };
  return { send };
}
