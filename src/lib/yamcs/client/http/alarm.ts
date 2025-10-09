import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
  HttpApiSchema,
} from "@effect/platform";
import { Schema } from "effect";
import { AlarmData, CommandId } from "../types";

const instanceParam = HttpApiSchema.param("instance", Schema.String);
const processorParam = HttpApiSchema.param("processor", Schema.String);
const alarmNameParam = HttpApiSchema.param("alarmName", Schema.String);
const sequenceNumberParam = HttpApiSchema.param(
  "sequenceNumber",
  Schema.String,
);

export const idParam = HttpApiSchema.param("id", CommandId);

export const alarmGroup = HttpApiGroup.make("alarm")
  .add(
    HttpApiEndpoint.get(
      "listAlarms",
    )`/archive/${instanceParam}/alarms`.addSuccess(
      Schema.Struct({
        alarms: Schema.Array(AlarmData),
      }),
    ),
  )
  .add(
    HttpApiEndpoint.post(
      "acknowledgeAlarm",
    )`/processors/${instanceParam}/${processorParam}/alarms/${alarmNameParam}/${sequenceNumberParam}%3Aacknowledge`
      .setPayload(
        Schema.Struct({
          comment: Schema.optional(Schema.String),
        }),
      )
      .addSuccess(
        Schema.Struct({
          alarms: Schema.Array(AlarmData),
        }),
      ),
  )
  .add(
    HttpApiEndpoint.post(
      "shelveAlarm",
    )`/processors/${instanceParam}/${processorParam}/alarms/${alarmNameParam}/${sequenceNumberParam}%3Ashelve`
      .setPayload(
        Schema.Struct({
          comment: Schema.optional(Schema.String),
          shelveDuration: Schema.NumberFromString,
        }),
      )
      .addSuccess(Schema.Any),
  )
  .add(
    HttpApiEndpoint.post(
      "clearAlarm",
    )`/processors/${instanceParam}/${processorParam}/alarms/${alarmNameParam}/${sequenceNumberParam}%3Aclear`
      .setPayload(
        Schema.Struct({
          comment: Schema.optional(Schema.String),
        }),
      )
      .addSuccess(Schema.Any),
  )
  .add(
    HttpApiEndpoint.post(
      "shelveAlarm",
    )`/processors/${instanceParam}/${processorParam}/alarms/${alarmNameParam}/${sequenceNumberParam}%3Aunshelve`.addSuccess(
      Schema.Any,
    ),
  )
  .addError(HttpApiError.NotFound);

export default alarmGroup;
