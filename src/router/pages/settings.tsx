import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Toggle, ToggleGroup } from "@/components/ui/toggle";
import { dashboardListAtom, DashboardListSchema } from "@/lib/atoms/dashboard";
import { useAtomValue } from "@effect-atom/atom-react";
import { KeyValueStore } from "@effect/platform";
import { BrowserKeyValueStore } from "@effect/platform-browser";
import { Effect, Layer, Logger, Schema } from "effect";
import { useRef } from "react";

export const saveDashboardString = (input: string) =>
  Effect.gen(function* () {
    const kv = yield* KeyValueStore.KeyValueStore;

    yield* Schema.decode(Schema.parseJson(DashboardListSchema))(input).pipe(
      Effect.tapErrorTag("ParseError", (e) =>
        Effect.logError("Unable to decode default dashboards ", e),
      ),
    );
    yield* kv.set("mrt-gs-dashboards", input);
  }).pipe(
    Effect.provide(
      Layer.merge(BrowserKeyValueStore.layerLocalStorage, Logger.pretty),
    ),
  );

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const dashboards = useAtomValue(dashboardListAtom);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function importDashboards(input: string) {
    Effect.runSync(
      saveDashboardString(input).pipe(
        Effect.catchTag("ParseError", (e) => Effect.logError(e.issue)),
      ),
    );
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      importDashboards(text);
    } catch (err) {
      console.error("Error reading JSON file:", err);
    } finally {
      e.target.value = ""; // Reset input so same file can be imported again
    }
  }

  function handleExport() {
    try {
      const jsonString = Schema.encodeSync(
        Schema.parseJson(DashboardListSchema),
      )(dashboards);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "dashboards.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting dashboards:", err);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 font-sans">
      <h1 className="text-2xl">Ground Station Settings</h1>
      <section className="space-y-2">
        <h2 className="text-xl">Theme</h2>
        <ToggleGroup value={[theme]} onValueChange={([v]) => setTheme(v)}>
          <Toggle value="system">System</Toggle>
          <Toggle value="light">Light</Toggle>
          <Toggle value="dark">Dark</Toggle>
        </ToggleGroup>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl">Dashboards</h2>
        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            Import
          </Button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button variant="outline" onClick={handleExport}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            Export
          </Button>
        </div>
      </section>
    </div>
  );
}
