import { Atom } from "@effect-atom/atom-react";
import { Effect, Layer, Logger } from "effect";
import { YamcsClient } from "..";
import { ParameterInfo } from "../types";

class ParameterService extends Effect.Service<ParameterService>()(
	"ParameterService",
	{
		dependencies: [YamcsClient.layer],
		scoped: Effect.gen(function*() {
			const httpClient = yield* YamcsClient;
			const paramList = yield* httpClient.mdb.listParameters({
				path: { instance: "mqtt-frames" },
				urlParams: {},
			});

			const parameters: Map<string, typeof ParameterInfo.Type> = new Map();

			paramList.parameters.forEach((parameter) => {
				parameters.set(parameter.qualifiedName, parameter);
			});

			const list = Effect.sync(() => Array.from(parameters.values()));
			const getById = (id: string) => Effect.sync(() => parameters.get(id)).pipe(Effect.scoped);

			return { list, getById } as const;
		}),
	},
) { }

export const parameterRuntime = Atom.runtime(Layer.mergeAll(ParameterService.Default, Logger.pretty));

export const parametersAtom = parameterRuntime
	.atom(
		Effect.gen(function*() {
			const p = yield* ParameterService;
			return yield* p.list;
		}),
	)
	.pipe(Atom.withReactivity(["parameters"]));

export const parameterAtom = Atom.family((id: string) =>
	parameterRuntime
		.atom(
			Effect.gen(function*() {
				const p = yield* ParameterService;
				return yield* p.getById(id);
			}),
		)
		.pipe(Atom.withReactivity(["parameters"])),
);
