/* eslint-disable @typescript-eslint/no-explicit-any */
import { annotations } from "@/lib/utils/ui";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Schema } from "effect";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Badge } from "../ui/badge";
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
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: effectTsResolver(schema),
    defaultValues: {
      // @ts-expect-error I'm not sure why it doesn't recognize _tag here
      _tag: schema.fields._tag.ast.type.literal,
    },
  });

  const fields = getShape(schema);

  return (
    <form
      id="add-card-form"
      onSubmit={onSubmit && handleSubmit(onSubmit as any)}
      className="flex flex-col gap-4 font-[Public_Sans]"
    >
      {fields
        .filter((field) => field.key !== "_tag")
        .map((field) => (
          <div className="flex flex-col gap-2" key={field.key}>
            <div>{field.title ?? field.key}</div>
            <Input className="font-[JetBrains_Mono]" {...register(field.key)} />
            {errors[field.key]?.message && (
              <Badge variant="error">
                {errors[field.key]?.message as string}
              </Badge>
            )}
          </div>
        ))}
    </form>
  );
}
