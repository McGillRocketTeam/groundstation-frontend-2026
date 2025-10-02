import { AtomHttpApi, useAtomValue } from "@effect-atom/atom-react";
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import { Effect, Schedule } from "effect";
import { YamcsApi } from "./http";

export class YamcsClient extends AtomHttpApi.Tag<YamcsClient>()("YamcsClient", {
  api: YamcsApi,
  httpClient: FetchHttpClient.layer,
  baseUrl: "http://localhost:8090",
  transformClient: (client) =>
    client.pipe(
      HttpClient.withTracerDisabledWhen(() => true),
      HttpClient.tapRequest((req) =>
        Effect.logDebug(`[YAMCS HTTP]: ${req.url}`),
      ),
      HttpClient.mapRequest((req) =>
        HttpClientRequest.setUrl(req.url.replaceAll("%3A", ":"))(req),
      ),
      HttpClient.retryTransient({
        times: 3,
        schedule: Schedule.exponential("100 millis", 2),
      }),
    ),
}) {}

// create a wrapper that uses the types of this function to pass down but makes url params {} by default
export function useYamcs() {
  return useAtomValue(
    YamcsClient.query("mdb", "listParameters", {
      urlParams: {},
      path: {
        instance: "mqtt-frames",
      },
    }),
  );
}
