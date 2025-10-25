import { useMemo } from 'react'
import Map, { NavigationControl, Marker } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';

const MapCard = () => {
  const initialViewState = useMemo(() => ({
    longitude: -73.6,
    latitude: 45.5,
    zoom: 10,
  }), [])

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])

  const mapStyleUrl = 'https://api.maptiler.com/maps/streets/style.json?key=T3tvaasfaJA1424bXIt6'

  return (
    <div style={{ width: '100%', height: '100%' }}>
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
  )
}

export default MapCard