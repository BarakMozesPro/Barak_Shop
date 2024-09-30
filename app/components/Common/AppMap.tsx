"use client";
import Map, { Layer, LineLayer, Marker, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import Image from "next/image";
import type { Feature, LineString } from "geojson";

type MapProps = {
  width: number;
  height: number;
};

const AppMap = ({ width, height }: MapProps) => {
  const [viewState, setViewState] = useState({
    latitude: 31.7886443431394,
    longitude: 34.78956294963248,
    zoom: 14,
  });
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

  const geojson: Feature<LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        // Coordinates for a route within Israel (you can replace these with actual data)
        [34.78956294963248, 31.7886443431394],
        [34.791000, 31.788700],
        [34.793000, 31.790000],
        [34.795000, 31.792000],
        [34.797000, 31.794000],
      ],
    },
  };

  const routeLayer: LineLayer = {
    id: "route",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#0ea5e9",
      "line-width": 5,
    },
  };

  return (
    <Map
      mapboxAccessToken={token}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width, height }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Marker longitude={34.78956294963248} latitude={31.7886443431394} anchor="bottom">
        <Image src="/img/loc.png" alt="mappin" width={30} height={30} />
      </Marker>

      <Source id="route" type="geojson" data={geojson}>
        <Layer {...routeLayer} />
      </Source>
    </Map>
  );
};

export default AppMap;
