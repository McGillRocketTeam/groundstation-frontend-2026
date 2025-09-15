import { AtomHttpApi } from "@effect-atom/atom-react";
import { FetchHttpClient, HttpClient } from "@effect/platform";
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
      HttpClient.retryTransient({
        times: 3,
        schedule: Schedule.exponential("100 millis", 2),
      }),
    ),
}) {}
