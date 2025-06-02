import { TileLayer, Marker, Popup, Pane } from "react-leaflet";
import { atom, useRecoilState } from "recoil";
import { useState, Suspense, useContext } from "react";

import { mapLoadingState, mapViewModeState, cityViewConfigState } from "@components/RecoilContextProvider";
import ViewButton from "@components/Elements/ViewButton";
import BicycleInfrastructureData from "@components/BikeInfrastructTile/BicycleinfrastructureData";
import MapComponent from "@/components/BikeInfrastructTile/MapComponent";
import LoadingSpinner from "@components/Elements/LoadingSpinner";

/*
possible states:
BicycleNetwork,
AdministrativeAreas,
PublicTransport
*/

export default function BikeInfrastructTile({
  height = "h-96",
  width = "w-7/12",
  children,
}) {
  const [cityConfig] = useRecoilState(cityViewConfigState);
  const [mapLoading] = useRecoilState(mapLoadingState)

  return (
    <div
      className={`relative ${height} h-full ${width} bg-white rounded-2xl shadow-md`}
    >
      {/* loading indicator */}
      { mapLoading &&
      <div className="h-full w-full absolute z-[900] rounded-2xl">
        <div className="h-full w-full absolute z-[1000]">
          <div className="flex justify-center h-full relative">
            <LoadingSpinner className="mt-auto mb-auto" size="9"/>
          </div>
        </div>
        <div className="h-full w-full bg-white opacity-50" />
      </div>
      }
      {/* buttons here */}
      <div
        style={{
          paddingTop: "1rem",
          paddingRight: "1rem",
          display: "inline-flex",
          justifyContent: "end",
          gap: "10px",
          right: 0,
          position: "absolute",
          zIndex: 1000,
        }}
      >
        <ViewButton
          //mapViewContext={ViewMode.AdministrativeAreas}
          onClick={function () {
            throw new Error("Function not implemented.");
          }}
          type={"AdministrativeAreas"}
        />
        <ViewButton
          //mapViewContext={ViewMode.AdministrativeAreas}
          onClick={function () {
            throw new Error("Function not implemented.");
          }}
          type={"BicycleNetwork"}
        />
        <ViewButton
          onClick={function () {
            throw new Error("Function not implemented.");
          }}
          type={"Bikeability"}
        />
      </div>

        <MapComponent
          center={cityConfig.mapSettings.center}
          zoom={cityConfig.mapSettings.zoom}
          scrollWheelZoom={true}
          className="h-full rounded-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <BicycleInfrastructureData />
          <Pane name="popup" style={{ zIndex: 660 }}></Pane>
          <Pane name="tooltip" style={{ zIndex: 670 }}></Pane>
        </MapComponent>
    </div>
  );
}
