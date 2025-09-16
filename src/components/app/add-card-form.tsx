import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cardSchemaMap } from "@/lib/cards/card-configuration";
import { annotations } from "@/lib/utils/ui";

export function AddCardForm() {
  const schemas = Object.keys(cardSchemaMap);

  return (
    <div className="font-[Public_Sans]">
      <Combobox>
        <Combobox items={schemas}>
          <ComboboxInput placeholder="Select Card" />
          <ComboboxContent className="z-50">
            <ComboboxEmpty>No Items Found</ComboboxEmpty>
            <ComboboxList>
              {(key: keyof typeof cardSchemaMap) => (
                <ComboboxItem key={key} value={key}>
                  {annotations(cardSchemaMap[key]).title}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Combobox>
    </div>
  );
}
