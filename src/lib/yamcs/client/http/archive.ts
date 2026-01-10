import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
  HttpApiSchema,
} from "@effect/platform";
import { Schema } from "effect";
import { CommandId, Event } from "../types";

const instanceParam = HttpApiSchema.param("instance", Schema.String);

export const idParam = HttpApiSchema.param("id", CommandId);

export const archiveGroup = HttpApiGroup.make("archive")
  .add(
    HttpApiEndpoint.get("listEvents")`/${instanceParam}/events`.addSuccess(
      Schema.Struct({
        events: Schema.Array(Event),
      }),
    ),
  )
  .prefix("/archive")
  .addError(HttpApiError.NotFound);

export default archiveGroup;
