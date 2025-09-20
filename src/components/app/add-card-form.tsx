/* eslint-disable @typescript-eslint/no-explicit-any */
import { annotations } from "@/lib/utils/ui";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Schema } from "effect";
import { useForm, type SubmitHandler } from "react-hook-form";
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
  const {
    register,
    // control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: effectTsResolver(schema),
    defaultValues: {
      _tag: "Hello",
      text: "asdfsadf",
    },
  });

  const fields = getShape(schema);

  return (
    <form
      id="add-card-form"
      onSubmit={onSubmit && handleSubmit(onSubmit)}
      className="flex flex-col gap-4 font-[Public_Sans]"
    >
      {fields.map((field) => (
        <div className="flex flex-col gap-2" key={field.key}>
          <div>{field.title ?? field.key}</div>
          <Input className="font-[JetBrains_Mono]" {...register(field.key)} />
          <p className="text-error text-sm">
            {errors[field.key]?.message as string}
          </p>
        </div>
      ))}
    </form>
  );
}
