import { MapContainer, TileLayer, Marker, Popup, Pane } from "react-leaflet";

export default function MapComponent(props){
    const properties = Object.assign({}, props);
    delete properties.children;
    const children = props.children;
    return(
        <MapContainer {...properties}>
            {children}
        </MapContainer>
    )
}