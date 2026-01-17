// src/api/links.ts
export type LinkRow = {
  id: string;
  name: string;
  status: "OK" | "DISABLED" | "UNAVAILABLE" | string;
  dataIn?: number;
  dataOut?: number;
  metadata?: Record<string, unknown>;
};

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8090";
const INSTANCE = import.meta.env.VITE_YAMCS_INSTANCE ?? "ground_station"; // or "mqtt-packets"

export async function fetchLinks(): Promise<LinkRow[]> {
  const res = await fetch(`${API}/api/instances/${INSTANCE}/links`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  // normalize fields (tweak if your JSON uses different keys)
  return json.map((x: any) => ({
    id: x.name ?? x.id ?? crypto.randomUUID(),
    name: x.name ?? x.id ?? "Unknown",
    status: (x.status ?? x.state ?? (x.enabled ? "OK" : "UNAVAILABLE")).toUpperCase(),
    dataIn: x.dataIn ?? x.bytesIn ?? 0,
    dataOut: x.dataOut ?? x.bytesOut ?? 0,
    metadata: x,
  }));
}
