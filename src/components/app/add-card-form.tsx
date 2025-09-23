/* eslint-disable @typescript-eslint/no-explicit-any */
import { annotations } from "@/lib/utils/ui";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Schema } from "effect";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type SchemaType<T extends Schema.Schema<any, any>> = Schema.Schema.Type<T>;

// Extract "shape" (the object fields) from a TaggedStruct or Struct
function getShape(schema: any) {
  // @ts-expect error some effect magic necessary here
  if (schema.fields) {
    return Object.entries(schema.fields).map(([key, field]) => ({
      key: key as any,
      ...annotations(field as any),
    }));
  }

  return [];
}

export function AddCardForm<T extends Schema.Schema<any, any>>({
  schema,
  onSubmit,
}: {
  schema: T;
  onSubmit?: SubmitHandler<SchemaType<T>>;
}) {
  type FormData = SchemaType<T>;
  const form = useForm<FormData>({
    resolver: effectTsResolver(schema),
    defaultValues: {
      // @ts-expect-error I'm not sure why it doesn't recognize _tag here
      _tag: schema.fields._tag.ast.type.literal,
    },
  });

  const fields = getShape(schema);

  return (
    <Form {...form}>
      <form
        id="add-card-form"
        onSubmit={onSubmit && form.handleSubmit(onSubmit as any)}
        className="flex flex-col gap-4"
      >
        {fields
          .filter((field) => field.key !== "_tag")
          .map((formField) => (
            <FormField
              // @ts-expect-error we are doing some weird field stuff
              // here so types are wonky
              control={form.control}
              name={formField.key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{formField.title}</FormLabel>
                  <FormControl {...field} render={<Input />} />
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
      </form>
    </Form>
  );
}

{
  /* <div className="flex flex-col gap-2" key={field.key}> */
}
{
  /*   <div>{field.title ?? field.key}</div> */
}
{
  /*   <Input */
}
{
  /*     className="font-[JetBrains_Mono]" */
}
{
  /*     {...register(field.key)} */
}
{
  /*   /> */
}
{
  /*   {errors[field.key]?.message && ( */
}
{
  /*     <Badge variant="error"> */
}
{
  /*       {errors[field.key]?.message as string} */
}
{
  /*     </Badge> */
}
{
  /*   )} */
}
{
  /* </div> */
}
