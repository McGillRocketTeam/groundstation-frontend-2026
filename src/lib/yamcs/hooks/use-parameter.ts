import { useAtomValue } from "@effect-atom/atom-react";
import { YamcsClient } from "../client";
import type { QualifiedName } from "../client/types";

export function useParameter(qualifiedName: QualifiedName) {
  const info = useAtomValue(
    YamcsClient.query("mdb", "getParameter", {
      path: { instance: "mqtt-frames", name: qualifiedName },
    }),
  );

  return info;
}
