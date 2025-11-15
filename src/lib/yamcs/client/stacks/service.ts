import { Effect, pipe } from "effect";
import type { YCSStack } from "./schema";
import * as Stack from "./schema";

export class StackService extends Effect.Service<StackService>()(
  "StackService",
  {
    effect: Effect.fnUntraced(function* (stack: YCSStack) {
      const run = Effect.gen(function* () {
        const runStep = Effect.fnUntraced(function* (
          step: typeof Stack.Step.Type,
          index: number,
        ) {
          yield* Effect.logDebug(`[${index + 1}] Running step ${step.type}`);
          switch (step.type) {
            case "text":
              yield* Effect.log(step.text);
              break;
            case "check":
              yield* Effect.log(step.parameters);
              // Get the current states of the parameters
              // display them
              break;
            case "command":
              yield* Effect.log(step.name);
              // Post command to http
              // listen for command results on ws
              // wait until the next step signal (either defined in the command or globally)
              break;
            case "verify":
              yield* Effect.log(step.condition);
              // Listen to each of the parameters in parallel
              // as soon as it equals the desired value, mark it as verified
              // if they all are verified, succeed
              // if not by the timeout, fail
              break;
          }
        });

        yield* pipe(
          stack.steps,
          Effect.forEach((step, index) => runStep(step, index)),
        );
      });

      yield* Effect.log("test");
      return { run };
    }),
  },
) {}
