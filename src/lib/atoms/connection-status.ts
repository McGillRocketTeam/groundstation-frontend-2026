import { Atom } from "@effect-atom/atom-react";

export type ConnectionStatus = "disconnected" | "connected";

export const connectionStatusAtom = Atom.make<ConnectionStatus>(
  "disconnected",
).pipe(Atom.keepAlive);
