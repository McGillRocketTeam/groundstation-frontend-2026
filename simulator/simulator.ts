import { YamcsApi } from "@/lib/yamcs/client/http";
import { NamedObjectId, Value } from "@/lib/yamcs/client/types";
import { HttpApiClient } from "@effect/platform";
import {
  NodeContext,
  NodeHttpClient,
  NodeRuntime,
} from "@effect/platform-node";
import { Effect, Layer, Schema } from "effect";

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

class ParameterValueSchema extends Schema.Class<ParameterValueSchema>(
  "ParameterValueSchema",
)({
  id: NamedObjectId,
  generationTime: Schema.Date,
  engValue: Value,
}) {
  static fromMDB = Effect.gen(function* () {});
}

const simulator = Effect.gen(function* () {
  const yamcsHttp = yield* HttpApiClient.make(YamcsApi, {
    baseUrl: "http://localhost:8090",
  });

  const { parameters } = yield* yamcsHttp.mdb.listParameters({
    path: { instance: "ground_station" },
    urlParams: {},
  });
}).pipe(
  Effect.catchTag("RequestError", () =>
    Effect.logError(
      "Unable to request data from YAMCS. Are you running the backend on port 8090?",
    ),
  ),
);

const simulatorLayer = Layer.mergeAll(NodeContext.layer, NodeHttpClient.layer);

NodeRuntime.runMain(simulator.pipe(Effect.provide(simulatorLayer)));
