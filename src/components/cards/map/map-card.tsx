import Map, { Marker, NavigationControl } from "@vis.gl/react-maplibre";
import type { IDockviewPanelProps } from "dockview";
import maplibregl from "maplibre-gl";
import { useMemo } from "react";
import type { MapCardConfiguration } from ".";

export const MapCard = (
  props: IDockviewPanelProps<typeof MapCardConfiguration.Type>,
) => {
  const initialViewState = useMemo(
    () => ({
      longitude: props.params.long,
      latitude: props.params.lat,
      trackerLongitude: props.params.trackerLong,
      trackerLatitude: props.params.trackerLat,
      zoom: 10,
    }),
    [],
  );

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);

  const mapStyleUrl =
    "https://api.maptiler.com/maps/streets/style.json?key=T3tvaasfaJA1424bXIt6";

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        mapLib={maplibregl}
        initialViewState={initialViewState}
        style={containerStyle}
        mapStyle={mapStyleUrl}
      >
        <NavigationControl position="top-left" />
        <Marker longitude={-73.6} latitude={45.5} color="red" />
      </Map>
    </div>
  );
};
