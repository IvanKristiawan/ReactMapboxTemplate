import * as React from "react";
import { useState, useMemo } from "react";
import { render } from "react-dom";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from "react-map-gl";

import Pin from "./pin";

import CITIES from "./cities.json";

const TOKEN =
  "pk.eyJ1IjoiaXZhbi1rcmlzdGlhd2FuIiwiYSI6ImNsMWN4dHljZzA3Z2ozcHFjcnpxbDhnaTIifQ.Z7KSBghh93LRW-7aCNQzEg"; // Set your mapbox token here

export default function App() {
  const [popupInfo, setPopupInfo] = useState(null);

  const pins = useMemo(
    () =>
      CITIES.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <>
      <div style={{ width: "400px", height: "400px" }}>
        <Map
          initialViewState={{
            latitude: -7.7817,
            longitude: 110.42,
            zoom: 15,
            bearing: 0,
            pitch: 0
          }}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxAccessToken={TOKEN}
        >
          <GeolocateControl position="top-left" />
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          <ScaleControl />

          {pins}

          {popupInfo && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.longitude)}
              latitude={Number(popupInfo.latitude)}
              onClose={() => setPopupInfo(null)}
            >
              <div>
                {popupInfo.city}, {popupInfo.state} |{" "}
                <a
                  target="_new"
                  href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.city}, ${popupInfo.state}`}
                >
                  Wikipedia
                </a>
              </div>
              <img width="100%" src={popupInfo.image} />
            </Popup>
          )}
        </Map>
      </div>
    </>
  );
}

export function renderToDom(container) {
  render(<App />, container);
}
