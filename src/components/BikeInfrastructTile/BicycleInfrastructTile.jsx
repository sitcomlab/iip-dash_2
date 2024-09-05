import { MapContainer, TileLayer, Marker, Popup, Pane } from "react-leaflet";
import { atom, useRecoilState } from 'recoil';
import { useState, Suspense } from "react";
import dynamic from 'next/dynamic';

import { cityViewConfigState } from "@components/RecoilContextProvider";
import ViewButton from "@components/Elements/ViewButton";
import BicycleInfrastructureData from "@components/BikeInfrastructTile/BicycleinfrastructureData";
const MapComponent = dynamic(() => import('@/components/BikeInfrastructTile/MapComponent'), { ssr: false })

/*
possible states:
BicycleNetwork,
AdministrativeAreas,
PublicTransport
*/
const mapViewModeState = atom({
    key: 'mapViewMode',
    default: "BicycleNetwork"
})

export default function BikeInfrastructTile({height="h-96", width="w-7/12", children}) {
    const [cityConfig] = useRecoilState(cityViewConfigState)
    const [map, setMap] = useState(null)

    return (
        <div className={`relative ${height} min-h-96 ${width} bg-white rounded-2xl shadow-md m-2`}>

        {/* buttons here */}
        <div
          style={{
              paddingTop:'1rem',
              paddingRight:'1rem',
              display: 'inline-flex', justifyContent: 'end', gap: '10px',
              right: 0,
              position: 'absolute',
              zIndex: 1000,
          }}
          >
            <ViewButton
                //mapViewContext={ViewMode.AdministrativeAreas} 
                onClick={function (){
                    throw new Error('Function not implemented.');
                } } 
                type={'AdministrativeAreas'}            
            />
            <ViewButton
                //mapViewContext={ViewMode.AdministrativeAreas} 
                onClick={function (){
                    throw new Error('Function not implemented.');
                } } 
                type={'BicycleNetwork'}            
            />
        </div>

        {/*TODO: add spinner until MapComponent is loaded*/}
        <Suspense fallback={<p>loading...</p>}>
        <MapComponent
            center={cityConfig.mapSettings.center} 
            zoom={cityConfig.mapSettings.zoom} 
            scrollWheelZoom={true} 
            className="h-full rounded-2xl"
            ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
            <BicycleInfrastructureData map={map}/>
            <Pane name="popup" style={{ zIndex: 660 }}></Pane>
            <Pane name="tooltip" style={{ zIndex: 670 }}></Pane>
        </MapComponent>
        </Suspense>
        </div>
    )
}

export { mapViewModeState }