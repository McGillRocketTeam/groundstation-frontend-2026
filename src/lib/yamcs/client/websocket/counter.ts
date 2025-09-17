import { Effect, Ref } from "effect";

class Counter {
  inc: Effect.Effect<void>;
  get: Effect.Effect<number>;

  constructor(private value: Ref.Ref<number>) {
    this.inc = Ref.update(this.value, (n) => n + 1);
    this.get = Ref.get(this.value);
  }
}

export const makeCounter = (value: number) =>
  Effect.andThen(Ref.make(value), (value) => new Counter(value));
