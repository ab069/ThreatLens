import { create } from "zustand";

interface Threat {
  id: string; name: string; threat_type: string; severity: string;
  confidence: string; description: string; mitre_ttps: any; created_at: string;
}

interface ThreatState {
  threats: Threat[];
  addThreat: (t: Threat) => void;
  setThreats: (t: Threat[]) => void;
}

export const useThreatStore = create<ThreatState>((set) => ({
  threats: [],
  addThreat: (t) => set((s) => ({ threats: [t, ...s.threats] })),
  setThreats: (threats) => set({ threats }),
}));
