"use client";
import { cityViewConfigState } from "@/components/RecoilContextProvider";
import { useRecoilState } from "recoil";
import Image from "next/image";
import dynamic from "next/dynamic";
import { createContext, useState } from "react";

import { mapViewModeState } from "@components/RecoilContextProvider";
import { BikeabilityInfoTileSmall } from "@/components/BikeabilityInfoTile";
import BikeabilityInfoTile from "@/components/BikeabilityInfoTile";
import BIWeightsControlTile from "@/components/BIWeightsControlTile";
//import AdminAreaInfoTile from "@/components/AdminAreaInfoTile";
const AdminAreaInfoTile = dynamic(
  () => import("@/components/AdminAreaInfoTile"),
  { ssr: false },
);
import Navbar from "@/components/Elements/Navbar";
import PlusTile from "@/components/PlusTileMockup";
const BikeInfrastructTile = dynamic(
  () => import("@/components/BikeInfrastructTile/BicycleInfrastructTile"),
  { ssr: false },
);
import MapFeatureProvider from "@/components/MapFeatureProvider";
import { width } from "@mui/system";


export const MapContext = createContext({
  mapRef: {},
  setMapRef: () => {},
});

const cityConfig = {
  name: "Münster",
  mapSettings: {
    center: [51.962, 7.627],
    zoom: 12,
  },
  infrastructureSource: process.env.NEXT_PUBLIC_BICYCLE_INFRASTRUCTURE_URL_MS,
  bikeabilitySource: process.env.NEXT_PUBLIC_BIKEABILITY_API_URL_MS,
  anonymizationSource: process.env.NEXT_PUBLIC_ANONYMIZATION_API_URL_MS,
  biSegmentSource: process.env.NEXT_PUBLIC_OSM_BIKEABILITY_API_URL_MS,
};

export default function Münster() {
  const [mapRef, setMapRef] = useState(null);
  const mapValue = { mapRef, setMapRef };

  const [cityViewConfig, setCityViewConfig] =
    useRecoilState(cityViewConfigState);
  const [mapViewState] = useRecoilState(mapViewModeState); // Get the current map view state
  setCityViewConfig(cityConfig);

  return (
    <main className="flex min-h-dvh w-dvw flex-col items-center justify-start gap-2 sm:gap-4 pt-4 h-screen">
      <Navbar className="w-full flex justify-left pl-10" />
      <MapContext.Provider value={mapValue}>
        <MapFeatureProvider city={cityViewConfig}>
          <div
            className="w-screen flex grow min-h-0 md:flex-row flex-col-reverse"
          >
            {/* scroll wrapper */}
            <div className="overflow-y-scroll min-w-0">
              {/* scrollable container */}
              <div
              className="
              grid
              2xl:grid-cols-[min-content,min-content]
              xl:grid-cols-[min-content]
              lg:grid-cols-[min-content]
              md:grid-cols-[min-content]

              ">
              {mapViewState === "AdministrativeAreas" && (
                <AdminAreaInfoTile></AdminAreaInfoTile>
              )}
              {/*mapViewState === "Bikeability" && (
                <>
                <BIWeightsControlTile></BIWeightsControlTile>
                <BikeabilityInfoTile></BikeabilityInfoTile>
                </>
              )}
              {mapViewState === "BicycleNetwork" && (
                <>
                <BIWeightsControlTile></BIWeightsControlTile>
                <BikeabilityInfoTile></BikeabilityInfoTile>
                </>
              )

              While there is no difference between the views, conditional rendering is not necessary*/}

              <>
              <BIWeightsControlTile></BIWeightsControlTile>
              <BikeabilityInfoTile></BikeabilityInfoTile>
              </>
              </div>
          </div>

          {/* Fixed sidebar */}
          <div className="flex-1 md:flex-grow-1 min-h-[50vh] min-h-1/2 m-2">
          <BikeInfrastructTile height="h-[49rem] h-full" width="w-auto"></BikeInfrastructTile>
          </div>

          </div>
        </MapFeatureProvider>
      </MapContext.Provider>
    </main>
  );
}
