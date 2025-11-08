import Map, { Marker, NavigationControl } from "@vis.gl/react-maplibre";
import type { IDockviewPanelProps } from "dockview";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Suspense, useMemo } from "react";
import type { MapCardConfiguration } from ".";
import { parameterSubscriptionAtom } from "@/lib/yamcs/client/websocket/client";
import type { QualifiedName } from "@/lib/yamcs/client/types";
import { useAtomSuspense } from "@effect-atom/atom-react";


export const MapCard = (
  props: IDockviewPanelProps<typeof MapCardConfiguration.Type>,
) => {
  const {
    long,
    lat,
    trackerLong,
    trackerLat,
  } = props.params;

  // normalize numeric params: inputs may be strings from saved configs or the form
  const toNumber = (v: any) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  };

  const longitude = toNumber(long);
  const latitude = toNumber(lat);
  // initialViewState should only define the base map view (longitude, latitude, zoom)
  // tracker/marker coordinates are separate and should not be part of the base view
  const initialViewState = useMemo(
    () => ({
      longitude: longitude ?? 0,
      latitude: latitude ?? 0,
      zoom: 10,
    }),
    [longitude, latitude],
  );

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);

  const mapStyleUrl =
    "https://api.maptiler.com/maps/streets/style.json?key=T3tvaasfaJA1424bXIt6";

  return (
    // add a minHeight so the map is visible even if a parent doesn't provide an explicit height
    <div style={{ width: "100%", height: "100%", minHeight: 300 }}>
      <Map
        mapLib={maplibregl}
        initialViewState={initialViewState}
        style={containerStyle}
        mapStyle={mapStyleUrl}
      >
        <NavigationControl position="top-left" />
        {trackerLat && trackerLong && (
          <Suspense fallback={<div>Loading Marker Coordinates...</div>}>
            <ParameterMarker
              // trackerLat should be the latitude parameter, trackerLong the longitude parameter
              latParamName={trackerLat.qualifiedName}
              longParamName={trackerLong.qualifiedName}
            />
          </Suspense>
        )}
      </Map>
    </div>
  );
};



function ParameterMarker({ latParamName, longParamName }: { latParamName: QualifiedName; longParamName: QualifiedName }) {
  const latUpdate = useAtomSuspense(parameterSubscriptionAtom(latParamName)).value;
  const longUpdate = useAtomSuspense(parameterSubscriptionAtom(longParamName)).value;

  const parseNumber = (paramValue: any): number | undefined => {
    if (!paramValue) return undefined;
    const v = paramValue.endValue;
    if (v == null) return undefined;
    const candidate = (v as any).value ?? (v as any).raw ?? v;
    const n = Number(candidate);
    return Number.isFinite(n) ? n : undefined;
  };
  const lat = parseNumber(latUpdate);
  const longitude = parseNumber(longUpdate);

  // If we couldn't parse numeric coordinates, don't render the marker
  if (lat === undefined || longitude === undefined) return null;

  return <Marker longitude={longitude} latitude={lat} color="red" />;
}