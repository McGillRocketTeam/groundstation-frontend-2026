import { HttpApi } from "@effect/platform";
import commandGroup from "./command";
import linkGroup from "./link";
import mdbGroup from "./mdb";
import archiveGroup from "./archive";

export const YamcsApi = HttpApi.make("YAMCS")
  .add(mdbGroup)
  .add(commandGroup)
  .add(linkGroup)
  .add(archiveGroup)
  .prefix("/api");
