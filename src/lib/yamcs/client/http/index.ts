import { HttpApi } from "@effect/platform";
import mdbGroup from "./mdb";

export const YamcsApi = HttpApi.make("YAMCS").add(mdbGroup).prefix("/api");
