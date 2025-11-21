import React from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => (
  <div id="marker">
    <div id="map-pin"></div>
    <span className="label">{text}</span>
  </div>
);

export default function SimpleMap() {
  const defaultProps = {
    center: {
      lat: -20.18738947049977,
      lng: 57.47753115561966,
    },
    zoom: 18,
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAt_T5nsEgzGV9UAFOIZzsWpWjoVcofHhU" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={-20.18738947049977}
          lng={57.47753115561966}
          text="EO Solutions Ltd."
        />
      </GoogleMapReact>
    </div>
  );
}
