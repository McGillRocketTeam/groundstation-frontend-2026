import { HttpApi } from "@effect/platform";
import commandGroup from "./command";
import mdbGroup from "./mdb";

export const YamcsApi = HttpApi.make("YAMCS")
  .add(mdbGroup)
  .add(commandGroup)
  .prefix("/api");
