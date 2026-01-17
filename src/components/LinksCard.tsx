import { useEffect, useMemo, useState } from "react";
import { fetchLinks, type LinkRow } from "../api/links";

type State = "idle" | "loading" | "ready" | "error";

function statusChip(status: string) {
  const s = status.toUpperCase();
  const base =
    "inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-medium";
  if (s === "OK")
    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        <span className="h-2 w-2 rounded-full bg-green-500" />
        OK
      </span>
    );
  if (s.includes("DISABL"))
    return (
      <span className={`${base} bg-yellow-100 text-yellow-700`}>
        <span className="h-2 w-2 rounded-full bg-yellow-500" />
        DISABLED
      </span>
    );
  return (
    <span className={`${base} bg-red-100 text-red-700`}>
      <span className="h-2 w-2 rounded-full bg-red-500" />
      {s || "UNAVAILABLE"}
    </span>
  );
}

const fmtInt = (n: number | undefined) =>
  typeof n === "number" ? n.toLocaleString() : "0";

export default function LinksCard() {
  const [rows, setRows] = useState<LinkRow[]>([]);
  const [state, setState] = useState<State>("idle");
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // fetch + poll every 2s
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setState((s) => (s === "idle" ? "loading" : s));
      try {
        const data = await fetchLinks();
        if (!alive) return;
        setRows(data);
        setState("ready");
        setErr(null);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load links");
        setState("error");
      }
    };
    load();
    const t = setInterval(load, 2000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  // simple search filter
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.status, String(r.dataIn), String(r.dataOut)]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, query]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Data Links</h2>
          <p className="text-xs text-zinc-500">Live status from Yamcs</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="h-9 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400"
            placeholder="Filter links…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-xs text-zinc-500">
            {visible.length} / {rows.length}
          </span>
        </div>
      </div>

      {/* Error / loading */}
      {state === "loading" && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      )}

      {state === "error" && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* Table */}
      {state !== "loading" && (
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-zinc-50 text-left text-zinc-600">
              <tr>
                <th className="w-[45%] px-3 py-2">Name</th>
                <th className="w-[25%] px-3 py-2">Status</th>
                <th className="w-[15%] px-3 py-2 text-right">Data In</th>
                <th className="w-[15%] px-3 py-2 text-right">Data Out</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-6 text-center text-zinc-500"
                  >
                    No links to display.
                  </td>
                </tr>
              ) : (
                visible.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-zinc-100 hover:bg-zinc-50"
                  >
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.name}</div>
                      {/* tiny metadata preview */}
                      <div className="truncate text-xs text-zinc-500">
                        {r.metadata
                          ? Object.keys(r.metadata).slice(0, 3).join(" • ")
                          : ""}
                      </div>
                    </td>
                    <td className="px-3 py-2">{statusChip(r.status)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {fmtInt(r.dataIn)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {fmtInt(r.dataOut)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <span>Auto-refresh: 2s</span>
        <span>
          Tip: type to filter • statuses:{" "}
          <span className="font-medium">OK</span>,{" "}
          <span className="font-medium">DISABLED</span>,{" "}
          <span className="font-medium">UNAVAILABLE</span>
        </span>
      </div>
    </div>
  );
}
