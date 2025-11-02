import Map, { Marker, NavigationControl } from "@vis.gl/react-maplibre";
import type { IDockviewPanelProps } from "dockview";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo } from "react";
import type { MapCardConfiguration } from ".";

export const MapCard = (
  props: IDockviewPanelProps<typeof MapCardConfiguration.Type>,
) => {
  const {
    long,
    lat,
    tempTrackerLong,
    tempTrackerLat,
    trackerLong,
    trackerLat,
  } = props.params;

  // keep unused tracker variables referenced
  void trackerLong;
  void trackerLat;

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
  const markerLongitude = toNumber(tempTrackerLong);
  const markerLatitude = toNumber(tempTrackerLat);

  // debug: log parsed values to help trace why the map centers incorrectly
  // (leave as console.debug so it doesn't clutter production logs)
  console.debug("MapCard params parsed:", {
    raw: { long, lat, tempTrackerLong, tempTrackerLat },
    parsed: { longitude, latitude, markerLongitude, markerLatitude },
  });
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
        {/* only render the marker when both coords are present */}
        {typeof markerLongitude === "number" &&
          typeof markerLatitude === "number" && (
            <Marker
              longitude={markerLongitude}
              latitude={markerLatitude}
              color="red"
            />
          )}
      </Map>
    </div>
  );
};
