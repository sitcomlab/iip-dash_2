import { MapContainer, TileLayer, Marker, Popup, Pane } from "react-leaflet";
import { atom, useRecoilState } from 'recoil';
import { useState } from "react";

//TODO: move the cityView-config to an atom, and the definitions to each page
import { cityViewConfigState } from "@components/RecoilContextProvider";
import ViewButton from "@components/Elements/ViewButton";
import BicycleInfrastructureData from "@components/BikeInfrastructTile/BicycleinfrastructureData";

//TODO: implement viewmodes and start with one to make sure it works.

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

        <MapContainer 
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


        </MapContainer>
        </div>
    )
}

export { mapViewModeState }