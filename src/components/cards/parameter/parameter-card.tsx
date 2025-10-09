import type { IDockviewPanelProps } from "dockview-react";
import { ParameterCardConfiguration } from ".";

export function ParameterCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: IDockviewPanelProps<typeof ParameterCardConfiguration.Type>,
) {
  // const result = useAtomValue(parameterAtom(params.parameter.qualifiedName));

  return (
    <div className="h-full w-full overflow-scroll p-2">
      {/* {Result.match(result, { */}
      {/*   onInitial: () => <div>Loading...</div>, */}
      {/*   onFailure: (fail) => ( */}
      {/*     <pre className="whitespace-pre-wrap">{Cause.pretty(fail.cause)}</pre> */}
      {/*   ), */}
      {/*   onSuccess: ({ value }) => <pre>{JSON.stringify(value, null, 2)}</pre>, */}
      {/* })} */}
    </div>
  );
}
