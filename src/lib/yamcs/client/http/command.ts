import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
  HttpApiSchema,
} from "@effect/platform";
import { Schema } from "effect";
import { CommandHistoryEntry, CommandId, QualifiedName } from "../types";

const processorParam = HttpApiSchema.param("processor", Schema.String);
const instanceParam = HttpApiSchema.param("instance", Schema.String);
const nameParam = HttpApiSchema.param("name", QualifiedName);

export const idParam = HttpApiSchema.param("id", CommandId);

export const commandGroup = HttpApiGroup.make("command")
  .add(
    HttpApiEndpoint.get(
      "listCommands",
    )`/archive/${instanceParam}/commands`.addSuccess(Schema.Any),
  )
  .add(
    HttpApiEndpoint.get(
      "getCommand",
    )`/archive/${instanceParam}/commands/${idParam}`.addSuccess(
      CommandHistoryEntry,
    ),
  )
  .add(
    HttpApiEndpoint.post(
      "issueCommand",
    )`/api/processors/${instanceParam}/${processorParam}/commands/${nameParam}`
      .setPayload(Schema.Any)
      .addSuccess(Schema.Any),
  )
  .addError(HttpApiError.NotFound);

export default commandGroup;
