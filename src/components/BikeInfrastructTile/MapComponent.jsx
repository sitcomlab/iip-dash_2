import { MapContainer, TileLayer, Marker, Popup, Pane } from "react-leaflet";
import { useContext } from "react";
import { MapContext } from "@/app/muenster/page";

export default function MapComponent(props) {
  const { mapRef, setMapRef } = useContext(MapContext);

  function setMap(mapRef) {
    setMapRef(mapRef?.target);
  }

  const properties = Object.assign({}, props);
  delete properties.children;
  const children = props.children;
  return (
    <MapContainer {...properties} whenReady={setMap}>
      {children}
    </MapContainer>
  );
}
