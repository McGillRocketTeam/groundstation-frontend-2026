import { YamcsApi } from "@/lib/yamcs/client/http";
import { NamedObjectId, ParameterInfo, Value } from "@/lib/yamcs/client/types";
import { HttpApiClient } from "@effect/platform";
import {
  NodeContext,
  NodeHttpClient,
  NodeRuntime,
} from "@effect/platform-node";
import { Effect, Layer, Schedule, Schema } from "effect";

/*
	 {
				"parameter": [
						{
								"id": {"name": "/myproject/Battery1_Temp"},
								"generationTime": gentime,
								"engValue": {
										"type": "FLOAT",
										"floatValue": 123,
								},
						},
						{
								"id": {"name": "/myproject/ElapsedSeconds"},
								"generationTime": gentime,
								"engValue": {
										"type": "UINT32",
										"uint32Value": 123,
								},
						},
				]
		}
*/

class Random extends Effect.Service<Random>()("Random", {
  accessors: true,
  effect: Effect.gen(function* () {
    let date = new Date();

    const next = Effect.gen(function* () {
      yield* Effect.logWarning("Starting Random");
      date = new Date();
    });

    const generateValue: (
      mdb: typeof ParameterInfo.Type,
    ) => Effect.Effect<typeof Value.Type> = (mdb) =>
      Effect.gen(function* () {
        yield* Effect.log("Random");
        return { type: "FLOAT", value: 0 };
      });

    return { generateValue, next };
  }),
}) {}

class ParameterValueSchema extends Schema.Class<ParameterValueSchema>(
  "ParameterValueSchema",
)({
  id: NamedObjectId,
  generationTime: Schema.Date,
  engValue: Value,
}) {
  static fromMdb = (mdb: typeof ParameterInfo.Type) =>
    Effect.gen(function* () {
      const value = yield* Random.generateValue(mdb);

      return ParameterValueSchema.make({
        id: { name: mdb.qualifiedName },
        generationTime: new Date(),
        engValue: value,
      });
    });
}

const simulator = Effect.gen(function* () {
  const yamcsHttp = yield* HttpApiClient.make(YamcsApi, {
    baseUrl: "http://localhost:8090",
  });

  const { parameters } = yield* yamcsHttp.mdb.listParameters({
    path: { instance: "ground_station" },
    urlParams: {},
  });

  yield* Random.next;
  const payload = yield* Effect.forEach(parameters, (parameter) =>
    ParameterValueSchema.fromMdb(parameter),
  );
}).pipe(
  Effect.catchTag("RequestError", () =>
    Effect.logError(
      "Unable to request data from YAMCS. Are you running the backend on port 8090?",
    ),
  ),
  Effect.repeat(Schedule.spaced("10 seconds")),
);

const simulatorLayer = Layer.mergeAll(
  NodeContext.layer,
  NodeHttpClient.layer,
  Random.Default,
);

NodeRuntime.runMain(simulator.pipe(Effect.provide(simulatorLayer)));
