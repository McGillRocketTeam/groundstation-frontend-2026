import { Button } from "@/components/ui/button"; // Existing button component
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ui/theme-provider"; // Existing themme provider component
import { DashboardListSchema } from "@/lib/atoms/dashboard";
import { KeyValueStore } from "@effect/platform";
import { BrowserKeyValueStore } from "@effect/platform-browser";
import { Effect, Layer, Logger, Schema } from "effect";
import { getDashboardList } from "../router";

export const saveDashboardString = (input: string) =>
  Effect.gen(function* () {
    const kv = yield* KeyValueStore.KeyValueStore;

    console.log(input);
    yield* Schema.decodeUnknown(DashboardListSchema)(input).pipe(
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
  // Main export for this file
  const { theme, setTheme } = useTheme(); // useTheme hook to get current theme and setter function

  // Create “system dashboard” object that can be added to dashboards array whenever we need current system state

  // Export dashboards as JSON file
  const exportDashboards = () => {
    const dataToExport = Effect.runSync(getDashboardList);
    const dataStr = JSON.stringify(dataToExport, null, 2); // Convert the dashboards array into a JSON string
    const blob = new Blob([dataStr], { type: "application/json" }); // Wraps the JSON string in a Blob objec
    const url = URL.createObjectURL(blob); // Creates temp URL so blob can be downloaded.
    const a = document.createElement("a"); // Create an element that'll act as a link
    a.href = url; // a.href specifies what the link points to
    a.download = "dashboards.json"; // When link is clicked, download dashboards,json rathar than. navigating to it
    a.click(); // For auto download behavior
    URL.revokeObjectURL(url); // Free memory after download
  };

  // Import dashboards from JSON file
  // const importDashboards = () => {
  //   const input = document.createElement("input"); // Create element in memory
  //   input.type = "file"; // Makes it a file picker so the user can select a file from their computer
  //   input.accept = "application/json"; // Restrict the json only files
  //   input.onchange = (e: any) => {
  //     // onchange triggered after user selects a file
  //     const file = e.target.files[0]; // Take the first file from the FileList of all selected files
  //     const reader = new FileReader(); // File reader object to read the contents of the selected file
  //     reader.onload = () => {
  //       // Triggered when file is fully read from read.readAsText
  //       try {
  //         const data = JSON.parse(reader.result as string); // reader.result contains text content of the file, while JSON.parse converts text into Javascript object/array

  //         let systemDashboard: any = null; // Set to no dashboard found for now
  //         if (Array.isArray(data.dashboards)) {
  //           // Look for a dashboard with slug === "system"
  //           // If found, update systemDashboard
  //           systemDashboard = data.dashboards.find(
  //             (d: any) => d.slug === "system",
  //           );
  //         }
  //         if (systemDashboard) {
  //           // Update layout if a system dashboard exists
  //           currentSystemDockviewLayout = systemDashboard.dockviewLayout;
  //         }
  //         // Restore theme
  //         // Check theme is valid and update, else alert user
  //         if (
  //           data.theme === "light" ||
  //           data.theme === "dark" ||
  //           data.theme === "system"
  //         ) {
  //           setTheme(data.theme);
  //         } else {
  //           alert("Invalid JSON: theme value missing or incorrect.");
  //         }
  //       } catch {
  //         alert("Invalid JSON file."); // Else alert user of invalid file
  //       }
  //     };
  //     reader.readAsText(file); // Read file as plain text
  //   };
  //   input.click(); // Opens file dialog to select a file, will trigger input.onchange
  // };

  function importDashboards(input: string) {
    Effect.runSync(
      saveDashboardString(input).pipe(
        Effect.catchTag("ParseError", (e) => Effect.logError(e.issue)),
      ),
    );
  }

  return (
    <div className="space-y-8 p-6">
      {" "}
      {/* Adds padding around container and around child elements */}
      <h1 className="text-2xl font-bold">Settings</h1>{" "}
      {/* Display settings in large and bolded text in the main heading */}
      {/* Theme selection */}
      <section>
        <h2 className="mb-2 text-lg font-semibold">Theme</h2>{" "}
        {/* Underneath settings, have slightly smaller "Theme" */}
        {/* Dropdown menu will trigger on element click 
            Upon change, theme will be updated 
            + some padding and styling */}
        <select
          value={theme}
          onChange={(e) =>
            setTheme(e.target.value as "light" | "dark" | "system")
          }
          className="rounded border p-2"
        >
          <option value="system">System</option>{" "}
          {/* Each option is choice in the <select> dropdown */}
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </section>
      {/* Dashboard import/export */}
      <section className="space-x-4">
        {" "}
        {/* Group export and import buttons together, + padding */}
        <Button onClick={exportDashboards}>Export Dashboards</Button>{" "}
        {/* When button is clicked, call exportDashboards function*/}
        <Input
          type="file"
          onChange={async (event) => {
            const file = event.target.files[0];

            const contents = await file.text();

            importDashboards(contents);
          }}
        ></Input>
        {/* When button is clicked, call importDashboards function*/}
      </section>
    </div>
  );
}
