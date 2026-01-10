import { YamcsClient } from "@/lib/yamcs/client";
import type { QualifiedName } from "@/lib/yamcs/client/types";
import { parameterSubscriptionAtom } from "@/lib/yamcs/client/websocket/client";
import { useAtomSuspense } from "@effect-atom/atom-react";
import type { IDockviewPanelProps } from "dockview-react";
import { Suspense, useEffect, useState } from "react";
import { ParameterTableCardConfiguration } from ".";

export function ParameterTableCard({
  params,
}: IDockviewPanelProps<typeof ParameterTableCardConfiguration.Type>) {
  const { parameters } = useAtomSuspense(
    YamcsClient.query("mdb", "listParameters", {
      path: { instance: "mqtt-packets" },
      urlParams: {},
    }),
  ).value;

  return (
    <div className="h-full w-full overflow-auto p-4">
      <table className="min-w-full rounded-lg border border-gray-300">
        <thead className="bg-gray-100 text-black">
          <tr>
            <th className="border px-4 py-2 text-left">Parameter</th>
            <th className="border px-4 py-2 text-left">Value</th>
            <th className="border px-4 py-2 text-left">Unit</th>
          </tr>
        </thead>

        <tbody>
          {parameters.map((p) => (
            <Suspense
              key={p.qualifiedName}
              fallback={
                <tr>
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">Loading...</td>
                  <td className="border px-4 py-2">{p.type.unitSet?.join()}</td>
                </tr>
              }
            >
              <ParameterRow
                qualifiedName={p.qualifiedName}
                displayName={p.name}
                unit={p.type.unitSet?.map((s) => s.unit)?.join("") ?? ""}
              />
            </Suspense>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ParameterRow({
  qualifiedName,
  displayName,
  unit,
}: {
  qualifiedName: QualifiedName;
  displayName: string;
  unit: string;
}) {
  const param = useAtomSuspense(parameterSubscriptionAtom(qualifiedName));
  const engValue = param.value.engValue;

  const currentValue =
    "value" in engValue && typeof engValue.value === "number"
      ? engValue.value
      : null;

  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [change, setChange] = useState<"none" | "smaller" | "bigger">("none");

  useEffect(() => {
    if (currentValue === null) return;

    if (prevValue !== null) {
      if (currentValue > prevValue) setChange("bigger");
      else if (currentValue < prevValue) setChange("smaller");
      else setChange("none");
    }

    setPrevValue(currentValue);
  }, [currentValue]);

  return (
    <tr>
      <td className="border px-4 py-2">{displayName}</td>
      <td className="border px-4 py-2">
        <span>
          {currentValue !== null ? currentValue.toString() : "Unsupported"}
        </span>

        {change === "bigger" && <span className="text-green-600"> ▲</span>}
        {change === "smaller" && <span className="text-red-600"> ▼</span>}
      </td>
      <td className="border px-4 py-2">{unit}</td>
    </tr>
  );
}
