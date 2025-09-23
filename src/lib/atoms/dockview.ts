import { Atom } from "@effect-atom/atom-react";
import type { DockviewApi } from "dockview-react";
import { Effect, Option } from "effect";

export interface AddCardArgs {
  id: string;
  component: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}

//global dockviewApiAtom (writable)
export const dockviewApiAtom: Atom.Writable<Option.Option<DockviewApi>> =
  Atom.make(Option.none<DockviewApi>());

// global function atom
export const addCardAtom = Atom.fn(
  Effect.fnUntraced(function* (args: AddCardArgs, get: Atom.FnContext) {
    const apiOpt = get(dockviewApiAtom);
    if (Option.isNone(apiOpt)) {
      yield* Effect.logError(
        "Unable to add card because Dockview API is not ready.",
      );
      return yield* Effect.fail(new Error("Dockview API not ready"));
    }

    const api = apiOpt.value;

    try {
      console.log(args);
      api.addPanel({
        ...args,
      });
      return yield* Effect.succeed(true);
    } catch (err) {
      return yield* Effect.fail(err as Error);
    }
  }),
);
