import { structFields } from "@/lib/utils/schema";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Schema } from "effect";
import { useForm, type Path, type SubmitHandler } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ParameterSelector } from "./form/parameter-selector";

export type SchemaType<T extends Schema.Schema<any, any>> =
  Schema.Schema.Type<T>;

export function AddCardForm<T extends Schema.Schema<any, any>>({
  schema,
  defaultParams,
  onSubmit,
}: {
  schema: T;
  defaultParams?: any;
  onSubmit?: SubmitHandler<SchemaType<T>>;
}) {
  type FormData = SchemaType<T>;
  const form = useForm<FormData>({
    resolver: effectTsResolver(schema),
    defaultValues: {
      // @ts-expect-error I'm not sure why it doesn't recognize _tag here
      _tag: schema.fields._tag.ast.type.literal,
      ...defaultParams,
    },
  });

  const fields = structFields(schema);

  return (
    <Form {...form}>
      <form
        id="add-card-form"
        onSubmit={onSubmit && form.handleSubmit(onSubmit as any)}
        className="flex flex-col gap-4"
      >
        {fields
          .filter((field) => field.key !== "_tag")
          .map((formField) => {
            const fieldKey = formField.key as Path<FormData>;

            switch (formField.type) {
              case "boolean":
                return (
                  <FormField
                    defaultValue={false as any}
                    control={form.control}
                    name={fieldKey}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {formField.title ?? formField.key}
                        </FormLabel>
                        <FormControl
                          {...field}
                          render={(fieldControl) => (
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(v) =>
                                form.setValue(fieldKey, v as any)
                              }
                              {...fieldControl}
                            />
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              case "number":
                return (
                  <FormField
                    control={form.control}
                    name={fieldKey}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {formField.title ?? formField.key}
                        </FormLabel>
                        <FormControl
                          {...field}
                          render={(fieldControl) => (
                            <Input
                              {...fieldControl}
                              value={field.value}
                              onChange={(e) => {
                                form.setValue(
                                  fieldKey,
                                  e.target.valueAsNumber as any,
                                );
                              }}
                              type="number"
                            />
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );

              case "string":
                return (
                  <FormField
                    control={form.control}
                    name={fieldKey}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {formField.title ?? formField.key}
                        </FormLabel>
                        <FormControl
                          {...field}
                          render={(fieldControl) => <Input {...fieldControl} />}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              case "custom(YAMCSParameterInfo)":
                return (
                  <FormField
                    control={form.control}
                    name={fieldKey}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {formField.title ?? formField.key}
                        </FormLabel>
                        <FormControl
                          {...field}
                          render={(fieldControl) => (
                            <ParameterSelector
                              value={field.value}
                              onValueChange={(value) =>
                                form.setValue(fieldKey, value as any)
                              }
                              inputProps={fieldControl}
                            />
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              default:
                return (
                  <FormField
                    control={form.control}
                    name={fieldKey}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {formField.title ?? formField.key} "{formField.type}"
                        </FormLabel>
                        <FormControl
                          {...field}
                          render={(fieldControl) => <Input {...fieldControl} />}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
            }
          })}
      </form>
    </Form>
  );
}
