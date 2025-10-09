import { Atom } from "@effect-atom/atom-react";
import { Array, Effect, HashMap, Layer, Logger } from "effect";
import { YamcsClient } from "..";
import { ParameterInfo, QualifiedName } from "../types";

type ParameterEntry = {
  info: typeof ParameterInfo.Type;
  value: any;
};

class ParameterService extends Effect.Service<ParameterService>()(
  "ParameterService",
  {
    dependencies: [YamcsClient.layer],
    scoped: Effect.gen(function* () {
      const httpClient = yield* YamcsClient;

      const parameterInfoMap: HashMap.HashMap<
        QualifiedName,
        ParameterEntry["value"]
      > = HashMap.empty();
      // const parameterValueMap: HashMap.HashMap<QualifiedName, ParameterEntry["value"]> = HashMap.empty();

      // Intialize the info list, this data shouldn't change much
      // so we fetch it once when the service is started
      const paramList = yield* httpClient.mdb.listParameters({
        path: { instance: "mqtt-frames" },
        urlParams: {},
      });
      paramList.parameters.forEach((parameter) => {
        parameterInfoMap.pipe(HashMap.set(parameter.qualifiedName, parameter));
      });

      // @effect-diagnostics-next-line disable
      // const getEntry: (qualifiedName: QualifiedName) => ParameterEntry = (qualifiedName) => {
      // 	return {
      // 		info: parameterInfoMap.pipe(HashMap.get(qualifiedName)),
      // 		value: parameterValueMap.pipe(HashMap.get(qualifiedName))
      // 	}
      // }

      const list = Effect.sync(() =>
        Array.fromIterable(parameterInfoMap.pipe(HashMap.values)),
      );
      // const getById = (id: QualifiedName) => Effect.gen(function*() {
      // 	// return getEntry(id)
      // });

      return { list } as const;
    }),
  },
) {}

export const parameterRuntime = Atom.runtime(
  Layer.mergeAll(ParameterService.Default, Logger.pretty),
);

export const parametersAtom = parameterRuntime
  .atom(
    Effect.gen(function* () {
      const p = yield* ParameterService;
      return yield* p.list;
    }),
  )
  .pipe(Atom.withReactivity(["parameters"]));

// export const parameterAtom = Atom.family((id: string) =>
// 	parameterRuntime
// 		.atom(
// 			Effect.gen(function*() {
// 				const p = yield* ParameterService;
// 				return yield* p.getById(id);
// 			}),
// 		)
// 		.pipe(Atom.withReactivity(["parameters"])),
// );
