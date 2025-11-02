import Map, { Marker, NavigationControl } from "@vis.gl/react-maplibre";
// required CSS for maplibre controls and proper container styling
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

  // initialViewState should only define the base map view (longitude, latitude, zoom)
  // tracker/marker coordinates are separate and should not be part of the base view
  const initialViewState = useMemo(
    () => ({
      longitude: long,
      latitude: lat,
      zoom: 10,
    }),
    [long, lat],
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
        {typeof tempTrackerLong === "number" &&
          typeof tempTrackerLat === "number" && (
            <Marker
              longitude={tempTrackerLong}
              latitude={tempTrackerLat}
              color="red"
            />
          )}
      </Map>
    </div>
  );
};
