"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import BaseTile from "../BaseTile";

export default function MapTile({height="h-96", width="w-5/12", children}) {

    return (
        <div className={`${height} min-h-96 ${width} bg-white rounded-2xl shadow-md m-2`}>
            <MapContainer center={[51.96, 7.62]} zoom={13} scrollWheelZoom={false} className="h-full rounded-2xl">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>

        </div>
    )
}