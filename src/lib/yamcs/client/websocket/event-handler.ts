import type { Effect, Schema } from "effect";

export type EventHandler<A, I> = {
  readonly type: string;
  readonly schema: Schema.Schema<A, I>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly options: any;
  readonly handle: (data: A) => Effect.Effect<void, never, never>;
};

export const createEventHandler = <A, I>(
  handler: EventHandler<A, I>,
): EventHandler<A, I> => handler;
