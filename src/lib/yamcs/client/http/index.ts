import { HttpApi } from "@effect/platform";
import alarmGroup from "./alarm";
import commandGroup from "./command";
import linkGroup from "./link";
import mdbGroup from "./mdb";

export const YamcsApi = HttpApi.make("YAMCS")
  .add(mdbGroup)
  .add(commandGroup)
  .add(linkGroup)
  .add(alarmGroup)
  .prefix("/api");
