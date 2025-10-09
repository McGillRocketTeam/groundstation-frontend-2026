import { Badge } from "@/components/ui/badge";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import type { ParameterInfoType } from "@/lib/cards/types";
import { parametersAtom } from "@/lib/yamcs/client/service/parameterService";
import { Result, useAtomValue } from "@effect-atom/atom-react";

export function ParameterSelector({
  value,
  onValueChange,
  inputProps,
}: {
  value: ParameterInfoType;
  onValueChange: (value: ParameterInfoType) => void;
  inputProps?: any;
}) {
  const result = useAtomValue(parametersAtom);

  return Result.matchWithError(result, {
    onInitial: () => <div>Loading...</div>,
    onError: () => (
      <Badge variant="error">Unable to load parameter Selector.</Badge>
    ),
    onDefect: () => (
      <Badge variant="error">Unable to load parameter Selector.</Badge>
    ),
    onSuccess: (success) => {
      const data = success.value;
      if (!data) return null;

      return (
        <div className="flex w-full flex-col">
          <Combobox
            value={value}
            onValueChange={onValueChange}
            items={data as ParameterInfoType[]}
            itemToStringLabel={(item) => item.name}
            autoHighlight
          >
            <ComboboxTrigger {...inputProps}>
              {!value && (
                <span className="text-muted-foreground sm:text-sm">
                  Nothing Selected
                </span>
              )}
              <ComboboxValue />
              <ComboboxIcon />
            </ComboboxTrigger>
            <ComboboxPortal>
              <ComboboxPositioner className="z-50">
                <ComboboxPopup>
                  <div className="h-[var(--input-container-height)] p-2 text-center">
                    <ComboboxInput placeholder="Search Parameters..." />
                  </div>
                  <ComboboxEmpty>No Parameters Found.</ComboboxEmpty>
                  <ComboboxList>
                    {(parameter: ParameterInfoType) => (
                      <ComboboxItem
                        key={parameter.qualifiedName}
                        value={parameter}
                      >
                        <ComboboxItemIndicator />
                        <div className="col-start-2">
                          {parameter.qualifiedName}
                        </div>
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxPopup>
              </ComboboxPositioner>
            </ComboboxPortal>
          </Combobox>
        </div>
      );
    },
  });
}
