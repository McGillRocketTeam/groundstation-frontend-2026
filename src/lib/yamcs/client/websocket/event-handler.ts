import type { Effect, Schema } from "effect";

export type EventHandler<A, I> = {
  readonly type: string;
  readonly schema: Schema.Schema<A, I>;
  readonly handle: (data: A) => Effect.Effect<void, never, never>;
};

export const createEventHandler = <A, I>(
  handler: EventHandler<A, I>,
): EventHandler<A, I> => handler;
